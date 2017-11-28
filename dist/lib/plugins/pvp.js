'use strict';

var Vec3 = require("vec3").Vec3;
var UserError = require('flying-squid').UserError;

module.exports.player = function (player, serv) {

  player.updateHealth = function (health) {
    player.health = health;
    player._client.write('update_health', {
      food: player.food,
      foodSaturation: 0.0,
      health: player.health
    });
  };

  function attackEntity(entityId) {
    var attackedEntity = serv.entities[entityId];
    if (!attackedEntity || attackedEntity.gameMode != 0 && attackedEntity.type == 'player') return;

    player.behavior('attack', {
      attackedEntity: attackedEntity,
      velocity: attackedEntity.position.minus(player.position).plus(new Vec3(0, 0.5, 0)).scaled(5)
    }, function (o) {
      return o.attackedEntity.takeDamage(o);
    });
  }

  player._client.on("use_entity", function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        mouse = _ref.mouse,
        target = _ref.target;

    if (!serv.entities[target]) {
      var dragon = void 0;
      for (dragon = target - 1; dragon >= target - 7 && !serv.entities[dragon]; dragon--) {}
      if (serv.entities[dragon] && serv.entities[dragon].entityType == 63) target = dragon;
    }
    if (mouse == 1) attackEntity(target);
  });

  player.commands.add({
    base: 'kill',
    info: 'Kill entities',
    usage: '/kill <selector>',
    op: true,
    parse: function parse(str) {
      return str || false;
    },
    action: function action(sel) {
      var arr = player.selectorString(sel);
      if (arr.length == 0) throw new UserError('Could not find player');

      arr.map(function (entity) {
        return entity.takeDamage({ damage: 20 });
      });
    }
  });
};

module.exports.entity = function (entity, serv) {
  entity.takeDamage = function (_ref2) {
    var _ref2$sound = _ref2.sound,
        sound = _ref2$sound === undefined ? 'game.player.hurt' : _ref2$sound,
        _ref2$damage = _ref2.damage,
        damage = _ref2$damage === undefined ? 1 : _ref2$damage,
        _ref2$velocity = _ref2.velocity,
        velocity = _ref2$velocity === undefined ? new Vec3(0, 0, 0) : _ref2$velocity,
        _ref2$maxVelocity = _ref2.maxVelocity,
        maxVelocity = _ref2$maxVelocity === undefined ? new Vec3(4, 4, 4) : _ref2$maxVelocity,
        _ref2$animation = _ref2.animation,
        animation = _ref2$animation === undefined ? true : _ref2$animation;

    entity.updateHealth(entity.health - damage);
    serv.playSound(sound, entity.world, entity.position.scaled(1 / 32));

    entity.sendVelocity(velocity.scaled(1 / 32), maxVelocity);

    if (entity.health <= 0) {
      if (animation) entity._writeOthers('entity_status', {
        entityId: entity.id,
        entityStatus: 3
      });
      if (entity.type != "player") delete serv.entities[entity.id];
    } else if (animation) entity._writeOthers('animation', {
      entityId: entity.id,
      animation: 1
    });
  };

  if (entity.type != 'player') {
    entity.updateHealth = function (health) {
      entity.health = health;
    };
  }
};
//# sourceMappingURL=../../maps/lib/plugins/pvp.js.map
