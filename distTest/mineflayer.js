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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var net = require('net');
var mcServer = require("flying-squid");
var settings = require('../config/default-settings');
var mineflayer = require("mineflayer");
var assert = require('chai').assert;
var Vec3 = require('vec3').Vec3;

function assertPosEqual(actual, expected) {
  assert.isBelow(actual.distanceTo(expected), 1, "expected: " + expected + ", actual: " + actual + "\n");
}
var once = require('event-promise');

describe("Server with mineflayer connection", function () {
  var _this = this;

  var onGround = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(bot) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new _promise2.default(function (cb) {
                var l = function l() {
                  if (bot.entity.onGround) {
                    bot.removeListener("move", l);
                    cb();
                  }
                };
                bot.on("move", l);
              });

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function onGround(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var waitMessage = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(bot, message) {
      var msg1;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return once(bot, 'message');

            case 2:
              msg1 = _context2.sent;

              assert.equal(msg1.extra[0].text, message);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function waitMessage(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  var waitMessages = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(bot, messages) {
      var toReceive, received;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              toReceive = messages.reduce(function (acc, message) {
                acc[message] = 1;
                return acc;
              }, {});
              received = {};
              return _context3.abrupt('return', new _promise2.default(function (cb) {
                var listener = function listener(msg) {
                  var message = msg.extra[0].text;
                  if (!toReceive[message]) throw new Error("Received " + message + " , expected to receive one of " + messages);
                  if (received[message]) throw new Error("Received " + message + " two times");
                  received[message] = 1;
                  if ((0, _keys2.default)(received).length == messages.length) {
                    bot.removeListener('message', listener);
                    cb();
                  }
                };
                bot.on('message', listener);
              }));

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function waitMessages(_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();

  var waitLoginMessage = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(bot) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt('return', _promise2.default.all([waitMessages(bot, ['bot joined the game.', 'bot2 joined the game.'])]));

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function waitLoginMessage(_x6) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.timeout(10 * 60 * 1000);
  var bot = void 0;
  var bot2 = void 0;
  var serv = void 0;

  beforeEach((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var options;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            this.timeout(10 * 60 * 1000);
            options = settings;

            options["online-mode"] = false;
            options["port"] = 25566;
            options["view-distance"] = 2;
            options["worldFolder"] = undefined;

            serv = mcServer.createMCServer(options);

            _context5.next = 9;
            return once(serv, "listening");

          case 9:
            bot = mineflayer.createBot({
              host: "localhost",
              port: 25566,
              username: "bot"
            });
            bot2 = mineflayer.createBot({
              host: "localhost",
              port: 25566,
              username: "bot2"
            });

            _context5.next = 13;
            return _promise2.default.all([once(bot, 'login'), once(bot2, 'login')]);

          case 13:
            bot.entity.onGround = false;
            bot2.entity.onGround = false;

          case 15:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));

  afterEach((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return serv.quit();

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  })));

  describe("actions", function () {

    function waitSpawnZone(bot, view) {
      var nbChunksExpected = view * 2 * (view * 2);
      var c = 0;
      return new _promise2.default(function (cb) {
        var listener = function listener() {
          c++;
          if (c == nbChunksExpected) {
            bot.removeListener('chunkColumnLoad', listener);
            cb();
          }
        };
        bot.on('chunkColumnLoad', listener);
      });
    }

    it("can dig", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var pos, _ref8, _ref9, newBlock;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              this.timeout(10 * 60 * 1000);
              _context7.next = 3;
              return _promise2.default.all([waitSpawnZone(bot, 2), waitSpawnZone(bot2, 2), onGround(bot), onGround(bot2)]);

            case 3:
              pos = bot.entity.position.offset(0, -1, 0).floored();

              bot.dig(bot.blockAt(pos));

              _context7.next = 7;
              return once(bot2, 'blockUpdate', { array: true });

            case 7:
              _ref8 = _context7.sent;
              _ref9 = (0, _slicedToArray3.default)(_ref8, 2);
              newBlock = _ref9[1];

              assertPosEqual(newBlock.position, pos);
              assert.equal(newBlock.type, 0, "block " + pos + " should have been dug");

            case 12:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));

    it("can place a block", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var pos, _ref11, _ref12, oldBlock, newBlock, _ref13, _ref14;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              this.timeout(10 * 60 * 1000);
              _context8.next = 3;
              return _promise2.default.all([waitSpawnZone(bot, 2), waitSpawnZone(bot2, 2), onGround(bot), onGround(bot2)]);

            case 3:
              pos = bot.entity.position.offset(0, -2, 0).floored();

              bot.dig(bot.blockAt(pos));

              _context8.next = 7;
              return once(bot2, 'blockUpdate', { array: true });

            case 7:
              _ref11 = _context8.sent;
              _ref12 = (0, _slicedToArray3.default)(_ref11, 2);
              oldBlock = _ref12[0];
              newBlock = _ref12[1];

              assertPosEqual(newBlock.position, pos);
              assert.equal(newBlock.type, 0, "block " + pos + " should have been dug");

              bot.creative.setInventorySlot(36, new mineflayer.Item(1, 1));
              _context8.next = 16;
              return new _promise2.default(function (cb) {
                bot.inventory.on("windowUpdate", function (slot, oldItem, newItem) {
                  if (slot == 36 && newItem && newItem.type == 1) cb();
                });
              });

            case 16:

              bot.placeBlock(bot.blockAt(pos.offset(0, -1, 0)), new Vec3(0, 1, 0));

              _context8.next = 19;
              return once(bot2, 'blockUpdate', { array: true });

            case 19:
              _ref13 = _context8.sent;
              _ref14 = (0, _slicedToArray3.default)(_ref13, 2);
              oldBlock = _ref14[0];
              newBlock = _ref14[1];

              assertPosEqual(newBlock.position, pos);
              assert.equal(newBlock.type, 1, "block " + pos + " should have been placed");

            case 25:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
  });

  describe("commands", function () {

    it("has an help command", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return waitLoginMessage(bot);

            case 2:
              bot.chat("/help");
              _context9.next = 5;
              return once(bot, "message");

            case 5:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, _this);
    })));
    it("can use /particle", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              bot.chat("/particle 5 10 100 100 100");
              _context10.next = 3;
              return once(bot._client, 'world_particles');

            case 3:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, _this);
    })));
    it("can use /playsound", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              bot.chat('/playsound ambient.weather.rain');
              _context11.next = 3;
              return once(bot, 'soundEffectHeard');

            case 3:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, _this);
    })));

    function waitDragon() {
      return new _promise2.default(function (done) {
        var listener = function listener(entity) {
          if (entity.name == "EnderDragon") {
            bot.removeListener('entitySpawn', listener);
            done();
          }
        };
        bot.on('entitySpawn', listener);
      });
    }

    it("can use /summon", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              bot.chat('/summon EnderDragon');
              _context12.next = 3;
              return waitDragon();

            case 3:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, _this);
    })));
    it("can use /kill", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
      var entity;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              bot.chat('/summon EnderDragon');
              _context13.next = 3;
              return waitDragon();

            case 3:
              bot.chat('/kill @e[type=EnderDragon]');
              _context13.next = 6;
              return once(bot, 'entityDead');

            case 6:
              entity = _context13.sent;

              assert.equal(entity.name, "EnderDragon");

            case 8:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, _this);
    })));
    describe("can use /tp", function () {
      it("can tp myself", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                bot.chat('/tp 2 3 4');
                _context14.next = 3;
                return once(bot, 'forcedMove');

              case 3:
                assertPosEqual(bot.entity.position, new Vec3(2, 3, 4));

              case 4:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, _this);
      })));
      it("can tp somebody else", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                bot.chat('/tp bot2 2 3 4');
                _context15.next = 3;
                return once(bot2, 'forcedMove');

              case 3:
                assertPosEqual(bot2.entity.position, new Vec3(2, 3, 4));

              case 4:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, _this);
      })));
      it("can tp to somebody else", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return onGround(bot);

              case 2:
                bot.chat('/tp bot2 bot');
                _context16.next = 5;
                return once(bot2, 'forcedMove');

              case 5:
                assertPosEqual(bot2.entity.position, bot.entity.position);

              case 6:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, _this);
      })));
      it("can tp with relative positions", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
        var initialPosition;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return onGround(bot);

              case 2:
                initialPosition = bot.entity.position.clone();

                bot.chat('/tp ~1 ~-2 ~3');
                _context17.next = 6;
                return once(bot, 'forcedMove');

              case 6:
                assertPosEqual(bot.entity.position, initialPosition.offset(1, -2, 3));

              case 7:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, _this);
      })));
      it("can tp somebody else with relative positions", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
        var initialPosition;
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return _promise2.default.all([onGround(bot), onGround(bot2)]);

              case 2:
                initialPosition = bot2.entity.position.clone();

                bot.chat('/tp bot2 ~1 ~-2 ~3');
                _context18.next = 6;
                return once(bot2, 'forcedMove');

              case 6:
                assertPosEqual(bot2.entity.position, initialPosition.offset(1, -2, 3));

              case 7:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, _this);
      })));
    });
    it("can use /deop", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return waitLoginMessage(bot);

            case 2:
              bot.chat('/deop bot');
              _context19.next = 5;
              return waitMessage(bot, 'bot is deopped');

            case 5:
              bot.chat('/op bot');
              _context19.next = 8;
              return waitMessage(bot, 'You do not have permission to use this command');

            case 8:
              serv.getPlayer("bot").op = true;

            case 9:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, _this);
    })));
    it("can use /setblock", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
      var _ref27, _ref28, newBlock;

      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return once(bot, 'chunkColumnLoad');

            case 2:
              bot.chat('/setblock 1 2 3 95 0');
              _context20.next = 5;
              return once(bot, 'blockUpdate:' + new Vec3(1, 2, 3), { array: true });

            case 5:
              _ref27 = _context20.sent;
              _ref28 = (0, _slicedToArray3.default)(_ref27, 2);
              newBlock = _ref28[1];

              assert.equal(newBlock.type, 95);

            case 9:
            case 'end':
              return _context20.stop();
          }
        }
      }, _callee20, _this);
    })));
    it("can use /xp", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              bot.chat('/xp 100');
              _context21.next = 3;
              return once(bot, "experience");

            case 3:
              assert.equal(bot.experience.points, 100);

            case 4:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, _this);
    })));
  });
});
//# sourceMappingURL=maps/mineflayer.js.map
