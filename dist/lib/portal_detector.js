'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var findLineInDirection = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(world, startingPoint, type, direction, directionV) {
    var line, point;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            line = [];
            point = startingPoint;

          case 2:
            _context.next = 4;
            return world.getBlock(point);

          case 4:
            _context.t1 = _context.sent.name;
            _context.t2 = type;
            _context.t0 = _context.t1 == _context.t2;

            if (!_context.t0) {
              _context.next = 12;
              break;
            }

            _context.next = 10;
            return world.getBlockType(point.plus(directionV));

          case 10:
            _context.t3 = _context.sent;
            _context.t0 = _context.t3 == 0;

          case 12:
            if (!_context.t0) {
              _context.next = 17;
              break;
            }

            line.push(point);
            point = point.plus(direction);
            _context.next = 2;
            break;

          case 17:
            return _context.abrupt('return', line);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function findLineInDirection(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var findLine = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(world, startingPoint, type, direction, directionV) {
    var firstSegment, secondSegment;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return findLineInDirection(world, startingPoint.plus(direction.scaled(-1)), type, direction.scaled(-1), directionV);

          case 2:
            firstSegment = _context2.sent.reverse();
            _context2.next = 5;
            return findLineInDirection(world, startingPoint, type, direction, directionV);

          case 5:
            secondSegment = _context2.sent;
            return _context2.abrupt('return', firstSegment.concat(secondSegment));

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function findLine(_x6, _x7, _x8, _x9, _x10) {
    return _ref2.apply(this, arguments);
  };
}();

var findPotentialLines = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(world, startingPoint, directionV) {
    var _this = this;

    var firstLineDirection;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            firstLineDirection = directionV.y != 0 ? [new Vec3(1, 0, 0), new Vec3(0, 0, 1)] : [new Vec3(0, 1, 0)];
            _context4.next = 3;
            return _promise2.default.all(firstLineDirection.map(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(d) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.t0 = d;
                        _context3.next = 3;
                        return findLine(world, startingPoint, 'obsidian', d, directionV);

                      case 3:
                        _context3.t1 = _context3.sent;
                        return _context3.abrupt('return', {
                          direction: _context3.t0,
                          line: _context3.t1
                        });

                      case 5:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x14) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 3:
            _context4.t0 = function (line) {
              return line.line.length >= 3 && line.direction.y != 0 || line.line.length >= 2 && line.direction.y == 0;
            };

            return _context4.abrupt('return', _context4.sent.filter(_context4.t0));

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function findPotentialLines(_x11, _x12, _x13) {
    return _ref3.apply(this, arguments);
  };
}();

var findBorder = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(world, _ref5, directionV) {
    var line = _ref5.line,
        direction = _ref5.direction;

    var bottom, left, right, top, _ref7, _ref8, _ref9, horDir, _ref10, _ref11;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            bottom = line;

            if (!(bottom.length == 0)) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt('return', []);

          case 3:
            _context5.next = 5;
            return findLineInDirection(world, bottom[0].plus(direction.scaled(-1).plus(directionV)), 'obsidian', directionV, direction);

          case 5:
            left = _context5.sent;
            _context5.next = 8;
            return findLineInDirection(world, bottom[line.length - 1].plus(direction).plus(directionV), 'obsidian', directionV, direction.scaled(-1));

          case 8:
            right = _context5.sent;

            if (!(left.length == 0 || left.length != right.length)) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt('return', null);

          case 11:
            _context5.next = 13;
            return findLineInDirection(world, left[left.length - 1].plus(direction).plus(directionV), 'obsidian', direction, directionV.scaled(-1));

          case 13:
            top = _context5.sent;

            if (!(bottom.length != top.length)) {
              _context5.next = 16;
              break;
            }

            return _context5.abrupt('return', null);

          case 16:

            left = positiveOrder(left, directionV);
            right = positiveOrder(right, directionV);
            top = positiveOrder(top, direction);

            if (direction.y != 0) {
              _ref7 = [left, bottom, top, right];
              bottom = _ref7[0];
              left = _ref7[1];
              right = _ref7[2];
              top = _ref7[3];
            }

            _ref8 = directionV.y < 0 ? [top, bottom] : [bottom, top];
            _ref9 = (0, _slicedToArray3.default)(_ref8, 2);
            bottom = _ref9[0];
            top = _ref9[1];
            horDir = direction.x != 0 || directionV.x != 0 ? 'x' : 'z';
            _ref10 = direction[horDir] < 0 || directionV[horDir] < 0 ? [right, left] : [left, right];
            _ref11 = (0, _slicedToArray3.default)(_ref10, 2);
            left = _ref11[0];
            right = _ref11[1];

            if (!(bottom.length < 2 || top.length < 2 || left.length < 3 || right.length < 3)) {
              _context5.next = 31;
              break;
            }

            return _context5.abrupt('return', null);

          case 31:
            return _context5.abrupt('return', { bottom: bottom, left: left, right: right, top: top });

          case 32:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function findBorder(_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}();

var detectFrame = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(world, startingPoint, directionV) {
    var _this2 = this;

    var potentialLines;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return findPotentialLines(world, startingPoint, directionV);

          case 2:
            potentialLines = _context7.sent;
            _context7.t0 = asyncFilter;
            _context7.next = 6;
            return _promise2.default.all(potentialLines.map(function (line) {
              return findBorder(world, line, directionV);
            }));

          case 6:
            _context7.t1 = function (border) {
              return border != null;
            };

            _context7.t2 = function (_ref13) {
              var bottom = _ref13.bottom,
                  left = _ref13.left,
                  right = _ref13.right,
                  top = _ref13.top;
              return { bottom: bottom, left: left, right: right, top: top, air: getAir({ bottom: bottom, left: left, right: right, top: top }) };
            };

            _context7.t3 = _context7.sent.filter(_context7.t1).map(_context7.t2);

            _context7.t4 = function () {
              var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(_ref14) {
                var air = _ref14.air;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return isAllAir(world, air);

                      case 2:
                        return _context6.abrupt('return', _context6.sent);

                      case 3:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, _this2);
              }));

              return function (_x21) {
                return _ref15.apply(this, arguments);
              };
            }();

            return _context7.abrupt('return', (0, _context7.t0)(_context7.t3, _context7.t4));

          case 11:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function detectFrame(_x18, _x19, _x20) {
    return _ref12.apply(this, arguments);
  };
}();

var asyncEvery = function () {
  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(array, pred) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt('return', _promise2.default.all(array.map(function (x) {
              return pred(x).then(function (y) {
                return y ? true : _promise2.default.reject(false);
              });
            })).then(function (results) {
              return true;
            }).catch(function (x) {
              return false;
            }));

          case 1:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function asyncEvery(_x22, _x23) {
    return _ref16.apply(this, arguments);
  };
}();

var isAllAir = function () {
  var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(world, blocks) {
    var _this3 = this;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt('return', asyncEvery(blocks, function () {
              var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(block) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return world.getBlockType(block);

                      case 2:
                        _context9.t0 = _context9.sent;
                        return _context9.abrupt('return', _context9.t0 == 0);

                      case 4:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, _this3);
              }));

              return function (_x26) {
                return _ref18.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function isAllAir(_x24, _x25) {
    return _ref17.apply(this, arguments);
  };
}();

var makeWorldWithPortal = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(portal, additionalAir, additionalObsidian) {
    var world;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            world = new World(function () {
              return new Chunk();
            });
            _context11.next = 3;
            return addPortalToWorld(world, portal, additionalAir, additionalObsidian);

          case 3:
            return _context11.abrupt('return', world);

          case 4:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function makeWorldWithPortal(_x28, _x29, _x30) {
    return _ref19.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require("vec3").Vec3;
var assert = require('assert');
var flatMap = require('flatmap');
var range = require('range').range;

module.exports = { detectFrame: detectFrame, findPotentialLines: findPotentialLines, findBorder: findBorder, getAir: getAir, generateLine: generateLine, generatePortal: generatePortal, addPortalToWorld: addPortalToWorld, makeWorldWithPortal: makeWorldWithPortal };

function positiveOrder(line, direction) {
  if (direction.x == -1 || direction.y == -1 || direction.z == -1) return line.reverse();
  return line;
}

function asyncFilter(array, pred) {
  return _promise2.default.all(array.map(function (e) {
    return pred(e).then(function (a) {
      return a ? e : null;
    });
  })).then(function (r) {
    return r.filter(function (a) {
      return a != null;
    });
  });
}

function getAir(border) {
  var bottom = border.bottom,
      top = border.top;

  return flatMap(bottom, function (pos) {
    return range(1, top[0].y - bottom[0].y).map(function (i) {
      return pos.offset(0, i, 0);
    });
  });
}

var World = require('prismarine-world')(require("./version"));
var Chunk = require('prismarine-chunk')(require("./version"));

function generateLine(startingPoint, direction, length) {
  return range(0, length).map(function (i) {
    return startingPoint.plus(direction.scaled(i));
  });
}

function generatePortal(bottomLeft, direction, width, height) {
  var directionV = new Vec3(0, 1, 0);
  return {
    bottom: generateLine(bottomLeft.plus(direction), direction, width - 2),
    left: generateLine(bottomLeft.plus(directionV), directionV, height - 2),
    right: generateLine(bottomLeft.plus(direction.scaled(width - 1)).plus(directionV), directionV, height - 2),
    top: generateLine(bottomLeft.plus(directionV.scaled(height - 1).plus(direction)), direction, width - 2),
    air: flatMap(generateLine(bottomLeft.plus(direction).plus(directionV), direction, width - 2), function (p) {
      return generateLine(p, directionV, height - 2);
    })
  };
}

function addPortalToWorld(world, portal, additionalAir, additionalObsidian) {
  var setBlockType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  if (setBlockType == null) setBlockType = world.setBlockType.bind(world);
  var bottom = portal.bottom,
      left = portal.left,
      right = portal.right,
      top = portal.top,
      air = portal.air;


  var p = flatMap([bottom, left, right, top], function (border) {
    return border.map(function (pos) {
      return setBlockType(pos, 49);
    });
  });
  p.push(air.map(function (pos) {
    return setBlockType(pos, 0);
  }));

  p.push(additionalAir.map(function (pos) {
    return setBlockType(pos, 0);
  }));
  p.push(additionalObsidian.map(function (pos) {
    return setBlockType(pos, 49);
  }));

  return _promise2.default.all(p);
}
//# sourceMappingURL=../maps/lib/portal_detector.js.map
