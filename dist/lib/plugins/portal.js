"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require$portal_detec = require("flying-squid").portal_detector,
    detectFrame = _require$portal_detec.detectFrame,
    generatePortal = _require$portal_detec.generatePortal,
    addPortalToWorld = _require$portal_detec.addPortalToWorld;

var Vec3 = require("vec3").Vec3;
var UserError = require("flying-squid").UserError;

module.exports.player = function (player, serv) {
  var _this = this;

  player.use_flint_and_steel = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(referencePosition, direction, position) {
      var block, frames, air;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return player.world.getBlock(referencePosition);

            case 2:
              block = _context.sent;

              if (!(block.name == "obsidian")) {
                _context.next = 12;
                break;
              }

              _context.next = 6;
              return detectFrame(player.world, referencePosition, direction);

            case 6:
              frames = _context.sent;

              if (!(frames.length != 0)) {
                _context.next = 12;
                break;
              }

              air = frames[0].air;

              air.forEach(function (pos) {
                return player.setBlock(pos, 90, frames[0].bottom[0].x - frames[0].bottom[1].x != 0 ? 1 : 2);
              });
              player.world.portals.push(frames[0]);
              return _context.abrupt("return");

            case 12:
              player.changeBlock(position, 51, 0);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  player.on("dug", function (_ref2) {
    var position = _ref2.position,
        block = _ref2.block;


    function destroyPortal(portal) {
      var positionAlreadyDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      player.world.portals = player.world.portals.splice(player.world.portals.indexOf(portal), 1);
      portal.air.filter(function (ap) {
        return positionAlreadyDone == null || !ap.equals(positionAlreadyDone);
      }).forEach(function (ap) {
        return serv.setBlock(player.world, ap, 0, 0);
      });
    }

    if (block.name == "obsidian") {
      var p = player.world.portals.filter(function (_ref3) {
        var bottom = _ref3.bottom,
            top = _ref3.top,
            left = _ref3.left,
            right = _ref3.right;
        return [].concat.apply([], [bottom, left, right, top]).reduce(function (acc, pos) {
          return acc || pos.equals(position);
        }, false);
      });
      p.forEach(function (portal) {
        return destroyPortal(portal, position);
      });
    }

    if (block.name == "portal") {
      var _p = player.world.portals.filter(function (_ref4) {
        var air = _ref4.air;
        return air.reduce(function (acc, pos) {
          return acc || pos.equals(position);
        }, false);
      });
      _p.forEach(function (portal) {
        return destroyPortal(portal, position);
      });
    }
  });

  player.commands.add({
    base: 'portal',
    info: 'Create a portal frame',
    usage: '/portal <bottomLeft:<x> <y> <z>> <direction:x|z> <width> <height>',
    op: true,
    parse: function parse(str) {
      var pars = str.split(' ');
      if (pars.length != 6) return false;

      var _pars = (0, _slicedToArray3.default)(pars, 6),
          x = _pars[0],
          y = _pars[1],
          z = _pars[2],
          direction = _pars[3],
          width = _pars[4],
          height = _pars[5];

      var _map = [x, y, z].map(function (val, i) {
        return serv.posFromString(val, player.position[['x', 'y', 'z'][i]] / 32);
      });

      var _map2 = (0, _slicedToArray3.default)(_map, 3);

      x = _map2[0];
      y = _map2[1];
      z = _map2[2];

      var bottomLeft = new Vec3(x, y, z);
      if (direction != "x" && direction != "z") throw new UserError('Wrong Direction');
      direction = direction == 'x' ? new Vec3(1, 0, 0) : new Vec3(0, 0, 1);
      return { bottomLeft: bottomLeft, direction: direction, width: width, height: height };
    },
    action: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref5) {
        var _this2 = this;

        var bottomLeft = _ref5.bottomLeft,
            direction = _ref5.direction,
            width = _ref5.width,
            height = _ref5.height;
        var portal;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(width > 21 || height > 21)) {
                  _context3.next = 2;
                  break;
                }

                throw new UserError("Portals can only be 21x21!");

              case 2:
                portal = generatePortal(bottomLeft, direction, width, height);
                _context3.next = 5;
                return addPortalToWorld(player.world, portal, [], [], function () {
                  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(pos, type) {
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return serv.setBlock(player.world, pos, type, 0);

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this2);
                  }));

                  return function (_x6, _x7) {
                    return _ref7.apply(this, arguments);
                  };
                }());

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function action(_x5) {
        return _ref6.apply(this, arguments);
      }

      return action;
    }()
  });
};
//# sourceMappingURL=../../maps/lib/plugins/portal.js.map
