'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _nodePromiseEs = require('node-promise-es6');

var _prismarineProviderAnvil = require('prismarine-provider-anvil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spiralloop = require('spiralloop');

var World = require('prismarine-world')(require("../version"));

var generations = require("flying-squid").generations;


module.exports.server = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(serv) {
    var _this = this;

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        worldFolder = _ref2.worldFolder,
        _ref2$generation = _ref2.generation,
        generation = _ref2$generation === undefined ? { "name": "diamond_square", "options": { "worldHeight": 80 } } : _ref2$generation;

    var newSeed, seed, regionFolder, stats, levelData, generationModule;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            newSeed = generation.options.seed || Math.floor(Math.random() * Math.pow(2, 31));
            seed = void 0;
            regionFolder = void 0;

            if (!worldFolder) {
              _context2.next = 29;
              break;
            }

            regionFolder = worldFolder + "/region";
            _context2.prev = 5;
            _context2.next = 8;
            return _nodePromiseEs.fs.stat(regionFolder);

          case 8:
            stats = _context2.sent;
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](5);
            _context2.next = 15;
            return _nodePromiseEs.fs.mkdir(regionFolder);

          case 15:
            _context2.prev = 15;
            _context2.next = 18;
            return _prismarineProviderAnvil.level.readLevel(worldFolder + "/level.dat");

          case 18:
            levelData = _context2.sent;

            seed = levelData["RandomSeed"][0];
            _context2.next = 27;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t1 = _context2['catch'](15);

            seed = newSeed;
            _context2.next = 27;
            return _prismarineProviderAnvil.level.writeLevel(worldFolder + "/level.dat", { "RandomSeed": [seed, 0] });

          case 27:
            _context2.next = 30;
            break;

          case 29:
            seed = newSeed;

          case 30:
            generation.options.seed = seed;
            serv.emit("seed", generation.options.seed);
            generationModule = generations[generation.name] ? generations[generation.name] : require(generation.name);

            serv.overworld = new World(generationModule(generation.options), regionFolder);
            serv.netherworld = new World(generations["nether"]({}));
            //serv.endworld = new World(generations["end"]({}));

            // WILL BE REMOVED WHEN ACTUALLY IMPLEMENTED
            serv.overworld.blockEntityData = {};
            serv.netherworld.blockEntityData = {};
            serv.overworld.portals = [];
            serv.netherworld.portals = [];
            //////////////

            serv.pregenWorld = function (world) {
              var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

              var promises = [];
              for (var x = -size; x < size; x++) {
                for (var z = -size; z < size; z++) {
                  promises.push(world.getColumn(x, z));
                }
              }
              return _promise2.default.all(promises);
            };

            serv.setBlock = function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(world, position, blockType, blockData) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        serv.players.filter(function (p) {
                          return p.world == world;
                        }).forEach(function (player) {
                          return player.sendBlock(position, blockType, blockData);
                        });

                        _context.next = 3;
                        return world.setBlockType(position, blockType);

                      case 3:
                        _context.next = 5;
                        return world.setBlockData(position, blockData);

                      case 5:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x4, _x5, _x6, _x7) {
                return _ref3.apply(this, arguments);
              };
            }();

            serv.reloadChunks = function (world, chunks) {
              serv.players.filter(function (player) {
                return player.world == world;
              }).forEach(function (oPlayer) {
                chunks.filter(function (_ref4) {
                  var chunkX = _ref4.chunkX,
                      chunkZ = _ref4.chunkZ;
                  return oPlayer.loadedChunks[chunkX + "," + chunkZ] !== undefined;
                }).forEach(function (_ref5) {
                  var chunkX = _ref5.chunkX,
                      chunkZ = _ref5.chunkZ;
                  return oPlayer.unloadChunk(chunkX, chunkZ);
                });
                oPlayer.sendRestMap();
              });
            };

            //serv.pregenWorld(serv.overworld).then(() => serv.log('Pre-Generated Overworld'));
            //serv.pregenWorld(serv.netherworld).then(() => serv.log('Pre-Generated Nether'));

          case 42:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 11], [15, 22]]);
  }));

  return function (_x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.player = function (player, serv, settings) {
  var _this2 = this;

  player.unloadChunk = function (chunkX, chunkZ) {
    delete player.loadedChunks[chunkX + "," + chunkZ];
    player._client.write('map_chunk', {
      x: chunkX,
      z: chunkZ,
      groundUp: true,
      bitMap: 0x0000,
      chunkData: new Buffer(0)
    });
  };

  player.sendChunk = function (chunkX, chunkZ, column) {
    return player.behavior('sendChunk', {
      x: chunkX,
      z: chunkZ,
      chunk: column
    }, function (_ref6) {
      var x = _ref6.x,
          z = _ref6.z,
          chunk = _ref6.chunk;

      player._client.write('map_chunk', {
        x: x,
        z: z,
        groundUp: true,
        bitMap: 0xffff,
        chunkData: chunk.dump()
      });
      return _promise2.default.resolve();
    });
  };

  function spiral(arr) {
    var t = [];
    spiralloop(arr, function (x, z) {
      t.push([x, z]);
    });
    return t;
  }

  player.sendNearbyChunks = function (view, group) {
    player.lastPositionChunkUpdated = player.position;
    var playerChunkX = Math.floor(player.position.x / 16 / 32);
    var playerChunkZ = Math.floor(player.position.z / 16 / 32);

    (0, _keys2.default)(player.loadedChunks).map(function (key) {
      return key.split(",").map(function (a) {
        return parseInt(a);
      });
    }).filter(function (_ref7) {
      var _ref8 = (0, _slicedToArray3.default)(_ref7, 2),
          x = _ref8[0],
          z = _ref8[1];

      return Math.abs(x - playerChunkX) > view || Math.abs(z - playerChunkZ) > view;
    }).forEach(function (_ref9) {
      var _ref10 = (0, _slicedToArray3.default)(_ref9, 2),
          x = _ref10[0],
          z = _ref10[1];

      return player.unloadChunk(x, z);
    });

    return spiral([view * 2, view * 2]).map(function (t) {
      return {
        chunkX: playerChunkX + t[0] - view,
        chunkZ: playerChunkZ + t[1] - view
      };
    }).filter(function (_ref11) {
      var chunkX = _ref11.chunkX,
          chunkZ = _ref11.chunkZ;

      var key = chunkX + "," + chunkZ;
      var loaded = player.loadedChunks[key];
      if (!loaded) player.loadedChunks[key] = 1;
      return !loaded;
    }).reduce(function (acc, _ref12) {
      var chunkX = _ref12.chunkX,
          chunkZ = _ref12.chunkZ;

      var p = acc.then(function () {
        return player.world.getColumn(chunkX, chunkZ);
      }).then(function (column) {
        return player.sendChunk(chunkX, chunkZ, column);
      });
      return group ? p.then(function () {
        return sleep(5);
      }) : p;
    }, _promise2.default.resolve());
  };

  function sleep() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    return new _promise2.default(function (r) {
      return setTimeout(r, ms);
    });
  }

  player.sendMap = function () {
    return player.sendNearbyChunks(Math.min(3, settings["view-distance"])).catch(function (err) {
      return setTimeout(function () {
        throw err;
      });
    }, 0);
  };

  player.sendRestMap = function () {
    player.sendingChunks = true;
    player.sendNearbyChunks(Math.min(player.view, settings["view-distance"]), true).then(function () {
      return player.sendingChunks = false;
    }).catch(function (err) {
      return setTimeout(function () {
        throw err;
      }, 0);
    });
  };

  player.sendSpawnPosition = function () {
    player._client.write('spawn_position', {
      "location": player.spawnPoint
    });
  };

  player.changeWorld = function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(world, opt) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(player.world == world)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt('return', _promise2.default.resolve());

            case 2:
              opt = opt || {};
              player.world = world;
              player.loadedChunks = {};
              if (typeof opt.gamemode != 'undefined') player.gameMode = opt.gamemode;
              player._client.write("respawn", {
                dimension: opt.dimension || 0,
                difficulty: opt.difficulty || serv.difficulty,
                gamemode: opt.gamemode || player.gameMode,
                levelType: 'default'
              });
              _context3.next = 9;
              return player.findSpawnPoint();

            case 9:
              player.position = player.spawnPoint.toFixedPosition();
              player.sendSpawnPosition();
              player.updateAndSpawn();

              _context3.next = 14;
              return player.sendMap();

            case 14:

              player.sendSelfPosition();
              player.emit('change_world');

              _context3.next = 18;
              return player.waitPlayerLogin();

            case 18:
              player.sendRestMap();

            case 19:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    }));

    return function (_x9, _x10) {
      return _ref13.apply(this, arguments);
    };
  }();

  player.commands.add({
    base: 'changeworld',
    info: 'to change world',
    usage: '/changeworld overworld|nether',
    op: true,
    action: function action(world) {
      if (world == "nether") player.changeWorld(serv.netherworld, { dimension: -1 });
      if (world == "overworld") player.changeWorld(serv.overworld, { dimension: 0 });
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/world.js.map
