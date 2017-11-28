'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var once = require('event-promise');

module.exports.server = function (serv) {
  var _this = this;

  serv.quit = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Going down";
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _promise2.default.all(serv.players.map(function (player) {
              player.kick(reason);
              return once(player, 'disconnected');
            }));

          case 2:
            serv._server.close();
            _context.next = 5;
            return once(serv._server, "close");

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));
};

module.exports.player = function (player, serv) {
  player.despawnEntities = function (entities) {
    return player._client.write('entity_destroy', {
      'entityIds': entities.map(function (e) {
        return e.id;
      })
    });
  };

  player._client.on('end', function () {
    if (player && player.username) {
      serv.broadcast(serv.color.yellow + player.username + ' quit the game.');
      player._writeOthers('player_info', {
        action: 4,
        data: [{
          UUID: player._client.uuid
        }]
      });
      player.nearbyPlayers().forEach(function (otherPlayer) {
        return otherPlayer.despawnEntities([player]);
      });
      delete serv.entities[player.id];
      player.emit('disconnected');
      var index = serv.players.indexOf(player);
      if (index > -1) {
        serv.players.splice(index, 1);
      }
      delete serv.uuidToPlayer[player._client.uuid];
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/logout.js.map
