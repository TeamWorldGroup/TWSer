"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blocks = require("minecraft-data")(require("flying-squid").version).blocks;
var Vec3 = require("vec3").Vec3;

var materialToSound = {
  undefined: 'stone',
  'rock': 'stone',
  'dirt': 'grass',
  'plant': 'grass',
  'wool': 'cloth',
  'web': 'cloth',
  'wood': 'wood'
};

module.exports.player = function (player, serv) {
  var _this = this;

  player._client.on("block_place", function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        direction = _ref.direction,
        heldItem = _ref.heldItem,
        location = _ref.location;

    if (direction == -1 || heldItem.blockId == -1 || !blocks[heldItem.blockId]) return;
    var referencePosition = new Vec3(location.x, location.y, location.z);
    var directionVector = directionToVector[direction];
    var placedPosition = referencePosition.plus(directionVector);
    player.behavior('placeBlock', {
      direction: directionVector,
      heldItem: heldItem,
      id: heldItem.blockId,
      damage: heldItem.itemDamage,
      position: placedPosition,
      reference: referencePosition,
      playSound: true,
      sound: 'dig.' + (materialToSound[blocks[heldItem.blockId].material] || 'stone')
    }, function (_ref2) {
      var direction = _ref2.direction,
          heldItem = _ref2.heldItem,
          position = _ref2.position,
          playSound = _ref2.playSound,
          sound = _ref2.sound,
          id = _ref2.id,
          damage = _ref2.damage;

      if (playSound) {
        serv.playSound(sound, player.world, placedPosition.clone().add(new Vec3(0.5, 0.5, 0.5)), {
          pitch: 0.8
        });
      }

      player.inventory.slots[36 + player.heldItemSlot]--;
      console.log("place block id " + id + " damage " + damage);
      if (heldItem.blockId != 323) {
        player.changeBlock(position, id, damage);
        if (heldItem.blockId == 175) {
          player.changeBlock(position.plus(new Vec3(0, 1, 0)), id, 8);
        }
      } else if (direction == 1) {
        player.setBlock(position, 63, 0);
        player._client.write('open_sign_entity', {
          location: position
        });
      } else {
        player.setBlock(position, 68, 0);
        player._client.write('open_sign_entity', {
          location: position
        });
      }
    }, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var id, damage;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return player.world.getBlockType(placedPosition);

            case 2:
              id = _context.sent;
              _context.next = 5;
              return player.world.getBlockData(placedPosition);

            case 5:
              damage = _context.sent;

              player.sendBlock(placedPosition, id, damage);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this);
    })));
  });
};

var directionToVector = [new Vec3(0, -1, 0), new Vec3(0, 1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1), new Vec3(-1, 0, 0), new Vec3(1, 0, 0)];
//# sourceMappingURL=../../maps/lib/plugins/placeBlock.js.map
