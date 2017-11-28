"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require$portal_detec = require("flying-squid").portal_detector,
    detectFrame = _require$portal_detec.detectFrame,
    findPotentialLines = _require$portal_detec.findPotentialLines,
    findBorder = _require$portal_detec.findBorder,
    getAir = _require$portal_detec.getAir,
    generateLine = _require$portal_detec.generateLine,
    generatePortal = _require$portal_detec.generatePortal,
    makeWorldWithPortal = _require$portal_detec.makeWorldWithPortal;

var Vec3 = require("vec3").Vec3;
var assert = require('chai').assert;
var range = require('range').range;

describe("Generate portal", function () {
  it("generate a line", function () {
    assert.deepEqual(generateLine(new Vec3(3, 1, 1), new Vec3(1, 0, 0), 2), [new Vec3(3, 1, 1), new Vec3(4, 1, 1)]);
  });
  it("generate a portal", function () {
    assert.deepEqual(generatePortal(new Vec3(2, 1, 1), new Vec3(1, 0, 0), 4, 5), {
      bottom: generateLine(new Vec3(3, 1, 1), new Vec3(1, 0, 0), 2),
      left: generateLine(new Vec3(2, 2, 1), new Vec3(0, 1, 0), 3),
      right: generateLine(new Vec3(5, 2, 1), new Vec3(0, 1, 0), 3),
      top: generateLine(new Vec3(3, 5, 1), new Vec3(1, 0, 0), 2),
      air: generateLine(new Vec3(3, 2, 1), new Vec3(0, 1, 0), 3).concat(generateLine(new Vec3(4, 2, 1), new Vec3(0, 1, 0), 3))
    });
  });
});

describe("Detect portal", function () {
  this.timeout(60 * 1000);
  var portalData = [];
  portalData.push({
    name: "simple portal frame x",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 4,
    height: 5,
    additionalAir: [],
    additionalObsidian: []
  });
  portalData.push({
    name: "simple portal frame z",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(0, 0, 1),
    width: 4,
    height: 5,
    additionalAir: [],
    additionalObsidian: []
  });
  portalData.push({
    name: "big simple portal frame x",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 10,
    height: 10,
    additionalAir: [],
    additionalObsidian: []
  });
  portalData.push({
    name: "simple portal frame x with borders",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 4,
    height: 5,
    additionalAir: [],
    additionalObsidian: [new Vec3(2, 1, 1), new Vec3(5, 1, 1), new Vec3(2, 6, 1), new Vec3(5, 6, 1)]
  });

  var _generatePortal = generatePortal(new Vec3(2, 1, 2), new Vec3(1, 0, 0), 4, 5),
      bottom = _generatePortal.bottom,
      left = _generatePortal.left,
      right = _generatePortal.right,
      top = _generatePortal.top,
      air = _generatePortal.air;

  portalData.push({
    name: "2 portals",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 4,
    height: 5,
    additionalAir: air,
    additionalObsidian: [].concat.apply([], [bottom, left, right, top])
  });

  portalData.push({
    name: "huge simple portal frame z",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(0, 0, 1),
    width: 50,
    height: 50,
    additionalAir: [],
    additionalObsidian: []
  });

  portalData.forEach(function (_ref) {
    var name = _ref.name,
        bottomLeft = _ref.bottomLeft,
        direction = _ref.direction,
        width = _ref.width,
        height = _ref.height,
        additionalAir = _ref.additionalAir,
        additionalObsidian = _ref.additionalObsidian;

    var portal = generatePortal(bottomLeft, direction, width, height);
    var bottom = portal.bottom,
        left = portal.left,
        right = portal.right,
        top = portal.top,
        air = portal.air;

    describe("Detect " + name, function () {
      var expectedBorder = { bottom: bottom, left: left, right: right, top: top };

      var world = void 0;
      before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return makeWorldWithPortal(portal, additionalAir, additionalObsidian);

              case 2:
                world = _context.sent;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })));

      describe("detect potential first lines", function () {
        it("detect potential first lines from bottom left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
          var potentialLines;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return findPotentialLines(world, bottom[0], new Vec3(0, 1, 0));

                case 2:
                  potentialLines = _context2.sent;

                  assert.include(potentialLines, {
                    "direction": direction,
                    "line": bottom
                  });

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        })));

        it("detect potential first lines from bottom right", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
          var potentialLines;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return findPotentialLines(world, bottom[bottom.length - 1], new Vec3(0, 1, 0));

                case 2:
                  potentialLines = _context3.sent;

                  assert.include(potentialLines, {
                    "direction": direction,
                    "line": bottom
                  });

                case 4:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        })));

        it("detect potential first lines from top left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
          var potentialLines;
          return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return findPotentialLines(world, top[0], new Vec3(0, -1, 0));

                case 2:
                  potentialLines = _context4.sent;

                  assert.include(potentialLines, {
                    "direction": direction,
                    "line": top
                  });

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        })));

        it("detect potential first lines from top right", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
          var potentialLines;
          return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return findPotentialLines(world, top[top.length - 1], new Vec3(0, -1, 0));

                case 2:
                  potentialLines = _context5.sent;

                  assert.include(potentialLines, {
                    "direction": direction,
                    "line": top
                  });

                case 4:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        })));

        it("detect potential first lines from left top", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
          var potentialLines;
          return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return findPotentialLines(world, left[left.length - 1], direction);

                case 2:
                  potentialLines = _context6.sent;

                  assert.include(potentialLines, {
                    "direction": new Vec3(0, 1, 0),
                    "line": left
                  });

                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        })));

        it("detect potential first lines from right bottom", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
          var potentialLines;
          return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return findPotentialLines(world, right[0], direction.scaled(-1));

                case 2:
                  potentialLines = _context7.sent;

                  assert.include(potentialLines, {
                    "direction": new Vec3(0, 1, 0),
                    "line": right
                  });

                case 4:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        })));
      });

      describe("find borders", function () {
        it("find borders from bottom", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
          var border;
          return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return findBorder(world, {
                    "direction": direction,
                    "line": bottom
                  }, new Vec3(0, 1, 0));

                case 2:
                  border = _context8.sent;

                  assert.deepEqual(border, expectedBorder);

                case 4:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        })));

        it("find borders from top", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
          var border;
          return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return findBorder(world, {
                    "direction": direction,
                    "line": top
                  }, new Vec3(0, -1, 0));

                case 2:
                  border = _context9.sent;

                  assert.deepEqual(border, expectedBorder);

                case 4:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        })));

        it("find borders from left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
          var border;
          return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _context10.next = 2;
                  return findBorder(world, {
                    "direction": new Vec3(0, 1, 0),
                    "line": left
                  }, direction);

                case 2:
                  border = _context10.sent;

                  assert.deepEqual(border, expectedBorder);

                case 4:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        })));
        it("find borders from right", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
          var border;
          return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return findBorder(world, {
                    "direction": new Vec3(0, 1, 0),
                    "line": right
                  }, direction.scaled(-1));

                case 2:
                  border = _context11.sent;

                  assert.deepEqual(border, expectedBorder);

                case 4:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        })));
      });

      describe("detect portals", function () {
        it("detect portals from bottom left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
          var portals;
          return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return detectFrame(world, bottom[0], new Vec3(0, 1, 0));

                case 2:
                  portals = _context12.sent;

                  assert.deepEqual(portals, [portal]);

                case 4:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        })));
        it("detect portals from top left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
          var portals;
          return _regenerator2.default.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  _context13.next = 2;
                  return detectFrame(world, top[0], new Vec3(0, -1, 0));

                case 2:
                  portals = _context13.sent;

                  assert.deepEqual(portals, [portal]);

                case 4:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        })));
        it("detect portals from right top", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
          var portals;
          return _regenerator2.default.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  _context14.next = 2;
                  return detectFrame(world, right[right.length - 1], direction.scaled(-1));

                case 2:
                  portals = _context14.sent;

                  assert.deepEqual(portals, [portal]);

                case 4:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        })));
      });

      it("get air", function () {
        var foundAir = getAir(expectedBorder);
        assert.deepEqual(foundAir, air);
      });
    });
  });
});

describe("Doesn't detect non-portal", function () {
  var portalData = [];

  portalData.push({
    name: "simple portal frame x with one obsidian in the middle",
    bottomLeft: new Vec3(2, 1, 1),
    direction: new Vec3(1, 0, 0),
    width: 5,
    height: 5,
    additionalAir: [],
    additionalObsidian: [new Vec3(4, 3, 1)]
  });

  portalData.forEach(function (_ref16) {
    var name = _ref16.name,
        bottomLeft = _ref16.bottomLeft,
        direction = _ref16.direction,
        width = _ref16.width,
        height = _ref16.height,
        additionalAir = _ref16.additionalAir,
        additionalObsidian = _ref16.additionalObsidian;

    var portal = generatePortal(bottomLeft, direction, width, height);
    var bottom = portal.bottom,
        left = portal.left,
        right = portal.right,
        top = portal.top;

    describe("Doesn't detect detect " + name, function () {
      var world = void 0;
      before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return makeWorldWithPortal(portal, additionalAir, additionalObsidian);

              case 2:
                world = _context15.sent;

              case 3:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      })));

      describe("doesn't detect portals", function () {
        it("doesn't detect portals from bottom left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
          var portals;
          return _regenerator2.default.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  _context16.next = 2;
                  return detectFrame(world, bottom[0], new Vec3(0, 1, 0));

                case 2:
                  portals = _context16.sent;

                  assert.deepEqual(portals, []);

                case 4:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        })));
        it("doesn't detect portals from top left", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
          var portals;
          return _regenerator2.default.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return detectFrame(world, top[0], new Vec3(0, -1, 0));

                case 2:
                  portals = _context17.sent;

                  assert.deepEqual(portals, []);

                case 4:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17, this);
        })));
        it("doesn't detect portals from right top", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
          var portals;
          return _regenerator2.default.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _context18.next = 2;
                  return detectFrame(world, right[right.length - 1], direction.scaled(-1));

                case 2:
                  portals = _context18.sent;

                  assert.deepEqual(portals, []);

                case 4:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this);
        })));
      });
    });
  });
});
//# sourceMappingURL=maps/portal_detector.js.map
