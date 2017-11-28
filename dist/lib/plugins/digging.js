"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require("vec3").Vec3;

module.exports.player = function (player, serv) {
  var _this = this;

  var completeDigging = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(location) {
      var diggingTime, stop;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              clearInterval(animationInterval);
              diggingTime = new Date() - startDiggingTime;
              stop = false;

              if (expectedDiggingTime - diggingTime < 100) {
                stop = player.behavior('forceCancelDig', {
                  stop: true,
                  start: startDiggingTime,
                  time: diggingTime
                }).stop;
              }
              if (!stop) {
                player.behavior('dug', {
                  position: location,
                  block: currentlyDugBlock,
                  dropBlock: true,
                  blockDropPosition: location.offset(0.5, 0.5, 0.5),
                  blockDropWorld: player.world,
                  blockDropVelocity: new Vec3(Math.random() * 4 - 2, Math.random() * 2 + 2, Math.random() * 4 - 2),
                  blockDropId: currentlyDugBlock.type,
                  blockDropDamage: currentlyDugBlock.metadata,
                  blockDropPickup: 500,
                  blockDropDeath: 60 * 5 * 1000
                }, function (data) {
                  player.changeBlock(data.position, 0, 0);
                  if (data.dropBlock) dropBlock(data);
                }, cancelDig);
              } else {
                player._client.write("block_change", {
                  location: location,
                  type: currentlyDugBlock.type << 4
                });
              }

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function completeDigging(_x2) {
      return _ref7.apply(this, arguments);
    };
  }();

  function cancelDig(_ref) {
    var position = _ref.position,
        block = _ref.block;

    player.sendBlock(position, block.type, block.metadata);
  }

  player._client.on("block_dig", function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
      var location = _ref2.location,
          status = _ref2.status,
          face = _ref2.face;
      var pos, directionVector, facedPos, facedBlock, block;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pos = new Vec3(location.x, location.y, location.z);
              directionVector = directionToVector[face];
              facedPos = pos.plus(directionVector);
              _context.prev = 3;
              _context.next = 6;
              return player.world.getBlock(facedPos);

            case 6:
              facedBlock = _context.sent;
              block = void 0;

              if (!(facedBlock.name == "fire")) {
                _context.next = 13;
                break;
              }

              block = facedBlock;
              pos = facedPos;
              _context.next = 16;
              break;

            case 13:
              _context.next = 15;
              return player.world.getBlock(pos);

            case 15:
              block = _context.sent;

            case 16:

              currentlyDugBlock = block;

              if (!(currentlyDugBlock.type == 0)) {
                _context.next = 19;
                break;
              }

              return _context.abrupt("return");

            case 19:
              if (!(status == 0 && player.gameMode != 1)) {
                _context.next = 23;
                break;
              }

              player.behavior('dig', { // Start dig survival
                position: pos,
                block: block
              }, function (_ref4) {
                var position = _ref4.position;

                return startDigging(position);
              }, cancelDig);
              _context.next = 33;
              break;

            case 23:
              if (!(status == 2)) {
                _context.next = 27;
                break;
              }

              completeDigging(pos);
              _context.next = 33;
              break;

            case 27:
              if (!(status == 1)) {
                _context.next = 31;
                break;
              }

              player.behavior('cancelDig', { // Cancel dig survival
                position: pos,
                block: block
              }, function (_ref5) {
                var position = _ref5.position;

                return cancelDigging(position);
              });
              _context.next = 33;
              break;

            case 31:
              if (!(status == 0 && player.gameMode == 1)) {
                _context.next = 33;
                break;
              }

              return _context.abrupt("return", creativeDigging(pos));

            case 33:
              _context.next = 38;
              break;

            case 35:
              _context.prev = 35;
              _context.t0 = _context["catch"](3);

              setTimeout(function () {
                throw _context.t0;
              }, 0);

            case 38:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 35]]);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());

  function diggingTime() {
    // assume holding nothing and usual conditions
    return currentlyDugBlock.digTime();
  }

  var currentlyDugBlock = void 0;
  var startDiggingTime = void 0;
  var animationInterval = void 0;
  var expectedDiggingTime = void 0;
  var lastDestroyState = void 0;
  var currentAnimationId = void 0;
  function startDigging(location) {
    serv.entityMaxId++;
    currentAnimationId = serv.entityMaxId;
    expectedDiggingTime = diggingTime(location);
    lastDestroyState = 0;
    startDiggingTime = new Date();
    updateAnimation();
    animationInterval = setInterval(updateAnimation, 100);
    function updateAnimation() {
      var currentDiggingTime = new Date() - startDiggingTime;
      var newDestroyState = Math.floor(9 * currentDiggingTime / expectedDiggingTime);
      newDestroyState = newDestroyState > 9 ? 9 : newDestroyState;
      if (newDestroyState != lastDestroyState) {
        player.behavior('breakAnimation', {
          lastState: lastDestroyState,
          state: newDestroyState,
          start: startDigging,
          timePassed: currentDiggingTime,
          position: location
        }, function (_ref6) {
          var state = _ref6.state;

          lastDestroyState = state;
          player._writeOthersNearby("block_break_animation", {
            "entityId": currentAnimationId,
            "location": location,
            "destroyStage": state
          });
        });
      }
    }
  }

  function cancelDigging(location) {
    clearInterval(animationInterval);
    player._writeOthersNearby("block_break_animation", {
      "entityId": currentAnimationId,
      "location": location,
      "destroyStage": -1
    });
  }

  function dropBlock(_ref8) {
    var blockDropPosition = _ref8.blockDropPosition,
        blockDropWorld = _ref8.blockDropWorld,
        blockDropVelocity = _ref8.blockDropVelocity,
        blockDropId = _ref8.blockDropId,
        blockDropDamage = _ref8.blockDropDamage,
        blockDropPickup = _ref8.blockDropPickup,
        blockDropDeath = _ref8.blockDropDeath;

    serv.spawnObject(2, blockDropWorld, blockDropPosition, {
      velocity: blockDropVelocity,
      itemId: blockDropId,
      itemDamage: blockDropDamage,
      pickupTime: blockDropPickup,
      deathTime: blockDropDeath
    });
  }

  function creativeDigging(location) {
    player.behavior('dug', {
      position: location,
      block: currentlyDugBlock,
      dropBlock: false,
      blockDropPosition: location.offset(0.5, 0.5, 0.5),
      blockDropWorld: player.world,
      blockDropVelocity: new Vec3(Math.random() * 4 - 2, Math.random() * 2 + 2, Math.random() * 4 - 2),
      blockDropId: currentlyDugBlock.type,
      blockDropDamage: currentlyDugBlock.metadata,
      blockDropPickup: 500,
      blockDropDeath: 60 * 5 * 1000
    }, function (data) {
      player.changeBlock(data.position, 0, 0);
      if (data.dropBlock) dropBlock(data);
    }, cancelDig);
  }
};

var directionToVector = [new Vec3(0, -1, 0), new Vec3(0, 1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1), new Vec3(-1, 0, 0), new Vec3(1, 0, 0)];
//# sourceMappingURL=../../maps/lib/plugins/digging.js.map
