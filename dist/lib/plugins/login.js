'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require("vec3").Vec3;

var path = require('path');
var requireIndex = require('requireindex');
var plugins = requireIndex(path.join(__dirname, '..', 'plugins'));
var Command = require('flying-squid').Command;

module.exports.server = function (serv, options) {
  var _this = this;

  serv._server.on('connection', function (client) {
    return client.on('error', function (error) {
      return serv.emit('clientError', client, error);
    });
  });

  serv._server.on('login', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(client) {
      var player;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(client.socket.listeners('end').length == 0)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return');

            case 2:
              _context.prev = 2;
              player = serv.initEntity('player', null, serv.overworld, new Vec3(0, 0, 0));

              player._client = client;

              player.profileProperties = player._client.profile ? player._client.profile.properties : [];
              player.commands = new Command({});
              (0, _keys2.default)(plugins).filter(function (pluginName) {
                return plugins[pluginName].player != undefined;
              }).forEach(function (pluginName) {
                return plugins[pluginName].player(player, serv, options);
              });

              serv.emit("newPlayer", player);
              player.emit('asap');
              _context.next = 12;
              return player.login();

            case 12:
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](2);

              setTimeout(function () {
                throw _context.t0;
              }, 0);

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[2, 14]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

module.exports.player = function (player, serv, settings) {
  var _this2 = this;

  function addPlayer() {
    player.type = 'player';
    player.health = 20;
    player.food = 20;
    player.crouching = false; // Needs added in prismarine-entity later
    player.op = settings["everybody-op"]; // REMOVE THIS WHEN OUT OF TESTING
    player.username = player._client.username;
    serv.players.push(player);
    serv.uuidToPlayer[player._client.uuid] = player;
    player.heldItemSlot = 36;
    player.loadedChunks = {};
  }

  function sendLogin() {
    // send init data so client will start rendering world
    player._client.write('login', {
      entityId: player.id,
      levelType: 'default',
      gameMode: player.gameMode,
      dimension: 0,
      difficulty: serv.difficulty,
      reducedDebugInfo: false,
      maxPlayers: serv._server.maxPlayers
    });
    player.position = player.spawnPoint.toFixedPosition();
  }

  function sendChunkWhenMove() {
    player.on("move", function () {
      if (!player.sendingChunks && player.position.distanceTo(player.lastPositionChunkUpdated) > 16 * 32) player.sendRestMap();
    });
  }

  function updateTime() {
    player._client.write('update_time', {
      age: [0, 0],
      time: [0, serv.time]
    });
  }

  player.setGameMode = function (gameMode) {
    player.gameMode = gameMode;
    player._client.write('game_state_change', {
      reason: 3,
      gameMode: player.gameMode
    });
    serv._writeAll('player_info', {
      action: 1,
      data: [{
        UUID: player._client.uuid,
        gamemode: player.gameMode
      }]
    });
    player.sendAbilities();
  };

  function fillTabList() {
    player._writeOthers('player_info', {
      action: 0,
      data: [{
        UUID: player._client.uuid,
        name: player.username,
        properties: player.profileProperties,
        gamemode: player.gameMode,
        ping: player._client.latency
      }]
    });

    player._client.write('player_info', {
      action: 0,
      data: serv.players.map(function (otherPlayer) {
        return {
          UUID: otherPlayer._client.uuid,
          name: otherPlayer.username,
          properties: otherPlayer.profileProperties,
          gamemode: otherPlayer.gameMode,
          ping: otherPlayer._client.latency
        };
      })
    });
    setInterval(function () {
      return player._client.write('player_info', {
        action: 2,
        data: serv.players.map(function (otherPlayer) {
          return {
            UUID: otherPlayer._client.uuid,
            ping: otherPlayer._client.latency
          };
        })
      });
    }, 5000);
  }

  function announceJoin() {
    serv.broadcast(serv.color.yellow + player.username + ' joined the game.');
    player.emit("connected");
  }

  player.waitPlayerLogin = function () {
    var events = ["flying", "look"];
    return new _promise2.default(function (resolve) {

      var listener = function listener() {
        events.map(function (event) {
          return player._client.removeListener(event, listener);
        });
        resolve();
      };
      events.map(function (event) {
        return player._client.on(event, listener);
      });
    });
  };

  player.login = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!serv.uuidToPlayer[player._client.uuid]) {
              _context2.next = 3;
              break;
            }

            player.kick("You are already connected");
            return _context2.abrupt('return');

          case 3:
            if (!serv.bannedPlayers[player._client.uuid]) {
              _context2.next = 6;
              break;
            }

            player.kick(serv.bannedPlayers[player._client.uuid].reason);
            return _context2.abrupt('return');

          case 6:
            if (!serv.bannedIPs[player._client.socket.remoteAddress]) {
              _context2.next = 9;
              break;
            }

            player.kick(serv.bannedIPs[player._client.socket.remoteAddress].reason);
            return _context2.abrupt('return');

          case 9:

            addPlayer();
            _context2.next = 12;
            return player.findSpawnPoint();

          case 12:
            sendLogin();
            _context2.next = 15;
            return player.sendMap();

          case 15:
            player.sendSpawnPosition();
            player.sendSelfPosition();
            player.updateHealth(player.health);
            player.sendAbilities();

            updateTime();
            fillTabList();
            player.updateAndSpawn();

            announceJoin();
            player.emit("spawned");

            _context2.next = 26;
            return player.waitPlayerLogin();

          case 26:
            player.sendRestMap();
            sendChunkWhenMove();

          case 28:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this2);
  }));
};
//# sourceMappingURL=../../maps/lib/plugins/login.js.map
