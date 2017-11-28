"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require("vec3").Vec3;

module.exports.player = function (player) {
  var _this = this;

  player.on('placeBlock_cancel', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(opt, cancel) {
      var id, blockAbove;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!player.crouching) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return player.world.getBlockType(opt.reference);

            case 5:
              id = _context.sent;
              _context.next = 8;
              return player.world.getBlockType(opt.reference.plus(new Vec3(0, 1, 0)));

            case 8:
              blockAbove = _context.sent;

              if (!(id == 54)) {
                _context.next = 15;
                break;
              }

              opt.playSound = false;

              if (!blockAbove) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return");

            case 13:
              player._client.write("open_window", {
                windowId: 165,
                inventoryType: "minecraft:chest",
                windowTitle: (0, _stringify2.default)("Chest"),
                slotCount: 9 * 3 + 8 // 3 rows, make nicer later
              });
              cancel();

            case 15:
              _context.next = 20;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](2);

              setTimeout(function () {
                throw _context.t0;
              }, 0);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this, [[2, 17]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
//# sourceMappingURL=../../maps/lib/plugins/chest.js.map
