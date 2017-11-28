"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require("vec3").Vec3;

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

module.exports.server = function (serv, settings) {
  var _this = this;

  var findSpawnZone = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(world, initialPoint) {
      var point, p;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              point = initialPoint;

            case 1:
              _context.next = 3;
              return world.getBlockType(point);

            case 3:
              _context.t0 = _context.sent;

              if (!(_context.t0 == 0)) {
                _context.next = 8;
                break;
              }

              point = point.offset(0, -1, 0);
              _context.next = 1;
              break;

            case 8:
              if (!true) {
                _context.next = 17;
                break;
              }

              _context.next = 11;
              return world.getBlockType(point);

            case 11:
              p = _context.sent;

              if (!(p != 8 && p != 9)) {
                _context.next = 14;
                break;
              }

              return _context.abrupt("break", 17);

            case 14:
              point = point.offset(1, 0, 0);
              _context.next = 8;
              break;

            case 17:
              _context.next = 19;
              return world.getBlockType(point);

            case 19:
              _context.t1 = _context.sent;

              if (!(_context.t1 != 0)) {
                _context.next = 24;
                break;
              }

              point = point.offset(0, 1, 0);

              _context.next = 17;
              break;

            case 24:
              return _context.abrupt("return", point);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function findSpawnZone(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  serv.gameMode = settings.gameMode;
  serv.difficulty = settings.difficulty;

  serv.getSpawnPoint = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(world) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return findSpawnZone(world, new Vec3(randomInt(0, 30), 81, randomInt(0, 30)));

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }();
};

module.exports.player = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(player, serv) {
    var _this2 = this;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            player.gameMode = serv.gameMode;
            player.findSpawnPoint = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
              return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return serv.getSpawnPoint(player.world);

                    case 2:
                      player.spawnPoint = _context3.sent;

                    case 3:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, _this2);
            }));
            player._client.on('settings', function (_ref5) {
              var viewDistance = _ref5.viewDistance;

              player.view = viewDistance;
            });

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
//# sourceMappingURL=../../maps/lib/plugins/settings.js.map
