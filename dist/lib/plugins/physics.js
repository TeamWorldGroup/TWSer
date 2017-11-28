"use strict";

var _sign = require("babel-runtime/core-js/math/sign");

var _sign2 = _interopRequireDefault(_sign);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blocks = require("minecraft-data")(require("flying-squid").version).blocks;
var Vec3 = require("vec3").Vec3;

module.exports.entity = function (entity) {
  var _this = this;

  entity.calculatePhysics = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(delta) {
      var vSign, sizeSigned, xVec, yVec, zVec, xBlock, yBlock, zBlock, newPos;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (entity.gravity) {
                addGravity(entity, 'x', delta);
                addGravity(entity, 'y', delta);
                addGravity(entity, 'z', delta);
              }

              vSign = getSign(entity.velocity);
              sizeSigned = new Vec3(vSign.x * entity.size.x, vSign.y * entity.size.y, vSign.z * entity.size.z);
              xVec = entity.position.offset(entity.velocity.x * delta + sizeSigned.x / 2, 0, 0).scaled(1 / 32).floored();
              yVec = entity.position.offset(0, entity.velocity.y * delta + sizeSigned.y / 2, 0).scaled(1 / 32).floored();
              zVec = entity.position.offset(0, 0, entity.velocity.z * delta + sizeSigned.z / 2).scaled(1 / 32).floored();

              // Get block for each (x/y/z)Vec, check to avoid duplicate getBlockTypes

              _context.next = 8;
              return entity.world.getBlockType(xVec);

            case 8:
              _context.t0 = _context.sent;
              _context.t1 = blocks[_context.t0].boundingBox;
              xBlock = _context.t1 == 'block';

              if (!yVec.equals(xVec)) {
                _context.next = 15;
                break;
              }

              _context.t2 = xBlock;
              _context.next = 20;
              break;

            case 15:
              _context.next = 17;
              return entity.world.getBlockType(yVec);

            case 17:
              _context.t3 = _context.sent;
              _context.t4 = blocks[_context.t3].boundingBox;
              _context.t2 = _context.t4 == 'block';

            case 20:
              yBlock = _context.t2;

              if (!zVec.equals(yVec)) {
                _context.next = 25;
                break;
              }

              _context.t5 = yBlock;
              _context.next = 35;
              break;

            case 25:
              if (!zVec.equals(xVec)) {
                _context.next = 29;
                break;
              }

              _context.t6 = xBlock;
              _context.next = 34;
              break;

            case 29:
              _context.next = 31;
              return entity.world.getBlockType(zVec);

            case 31:
              _context.t7 = _context.sent;
              _context.t8 = blocks[_context.t7].boundingBox;
              _context.t6 = _context.t8 == 'block';

            case 34:
              _context.t5 = _context.t6;

            case 35:
              zBlock = _context.t5;


              if (xBlock || yBlock || zBlock) {
                entity.velocity.x = getFriction(entity.velocity.x, entity.friction.x, delta);
                entity.velocity.z = getFriction(entity.velocity.z, entity.friction.z, delta);
              }

              newPos = entity.position.clone();


              newPos.x += getMoveAmount('x', xBlock, entity, delta, sizeSigned.x);
              newPos.y += getMoveAmount('y', yBlock, entity, delta, sizeSigned.y);
              newPos.z += getMoveAmount('z', zBlock, entity, delta, sizeSigned.z);

              //serv.emitParticle(30, serv.overworld, entity.position.scaled(1/32), { size: new Vec3(0, 0, 0) });
              return _context.abrupt("return", { position: newPos, onGround: yBlock });

            case 42:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  entity.sendVelocity = function (vel, maxVel) {
    var velocity = vel.scaled(32).floored(); // Make fixed point
    var maxVelocity = maxVel.scaled(32).floored();
    var scaledVelocity = velocity.scaled(8000 / 32 / 20).floored(); // from fixed-position/second to unit => 1/8000 blocks per tick
    entity._writeNearby('entity_velocity', {
      entityId: entity.id,
      velocityX: scaledVelocity.x,
      velocityY: scaledVelocity.y,
      velocityZ: scaledVelocity.z
    });
    if (entity.type != 'player') {
      if (maxVelocity) entity.velocity = addVelocityWithMax(entity.velocity, velocity, maxVelocity);else entity.velocity.add(velocity);
    }
  };

  function getMoveAmount(dir, block, entity, delta, sizeSigned) {
    if (block) {
      entity.velocity[dir] = 0;
      return Math.floor(-1 * (entity.position[dir] + sizeSigned / 2 - floorInDirection(entity.position[dir], -sizeSigned)));
    } else {
      return Math.floor(entity.velocity[dir] * delta);
    }
  }

  function getSign(vec) {
    return new Vec3((0, _sign2.default)(vec.x), (0, _sign2.default)(vec.y), (0, _sign2.default)(vec.z));
  }

  function floorInDirection(a, b) {
    return b < 0 ? Math.floor(a) : Math.ceil(a);
  }

  function addGravity(entity, dir, delta) {
    if (entity.velocity[dir] < entity.terminalvelocity[dir] && entity.velocity[dir] > -entity.terminalvelocity[dir]) {
      entity.velocity[dir] = clamp(-entity.terminalvelocity[dir], entity.velocity[dir] + entity.gravity[dir] * delta, entity.terminalvelocity[dir]);
    }
  }

  function getFriction(vel, fric, delta) {
    return vel > 0 ? Math.max(0, vel - fric * delta) : Math.min(0, vel + fric * delta);
  }

  function clamp(a, b, c) {
    return Math.max(a, Math.min(b, c));
  }

  function addVelocityWithMax(current, newVel, max) {
    var x = void 0,
        y = void 0,
        z = void 0;
    if (current.x > max.x || current.x < -max.x) x = current.x;else x = Math.max(-max.x, Math.min(max.x, current.x + newVel.x));
    if (current.y > max.y || current.y < -max.y) y = current.y;else y = Math.max(-max.y, Math.min(max.y, current.y + newVel.y));
    if (current.z > max.z || current.z < -max.z) z = current.z;else z = Math.max(-max.z, Math.min(max.z, current.z + newVel.z));
    return new Vec3(x, y, z);
  }
};

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'velocity',
    info: 'Push velocity on player(s)',
    usage: '/velocity <player> <x> <y> <z>',
    op: true,
    parse: function parse(str) {
      return str.match(/(.+?) (\d+) (\d+) (\d+)/) || false;
    },
    action: function action(params) {
      var selector = player.selectorString(params[1]);
      var vec = new Vec3(parseInt(params[2]), parseInt(params[3]), parseInt(params[4]));
      selector.forEach(function (e) {
        return e.sendVelocity(vec, vec.scaled(5));
      });
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/physics.js.map
