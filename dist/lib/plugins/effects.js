'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.entity = function (entity, serv) {
  entity.effects = {};
  for (var i = 1; i <= 23; i++) {
    // 23 in 1.8, 27 in 1.9
    entity.effects[i] = null; // Just so we know it's a real potion and not undefined/not existant
  }

  entity.sendEffect = function (effectId) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$amplifier = _ref.amplifier,
        amplifier = _ref$amplifier === undefined ? 0 : _ref$amplifier,
        _ref$duration = _ref.duration,
        duration = _ref$duration === undefined ? 30 * 20 : _ref$duration,
        _ref$particles = _ref.particles,
        particles = _ref$particles === undefined ? true : _ref$particles,
        whitelist = _ref.whitelist,
        _ref$blacklist = _ref.blacklist,
        blacklist = _ref$blacklist === undefined ? [] : _ref$blacklist;

    if (!whitelist) whitelist = serv.getNearby(entity);
    if (entity.type == 'player' && [1].indexOf(effectId) != -1) entity.sendAbilities();
    var sendTo = whitelist.filter(function (p) {
      return blacklist.indexOf(p) == -1;
    });
    var data = {
      entityId: entity.id,
      effectId: effectId,
      amplifier: amplifier,
      duration: duration,
      hideParticles: !particles
    };
    serv._writeArray('entity_effect', data, sendTo);
  };

  entity.sendRemoveEffect = function (effectId) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        whitelist = _ref2.whitelist,
        _ref2$blacklist = _ref2.blacklist,
        blacklist = _ref2$blacklist === undefined ? [] : _ref2$blacklist;

    if (!whitelist) whitelist = serv.getNearby(entity);
    var sendTo = whitelist.filter(function (p) {
      return blacklist.indexOf(p) == -1;
    });
    serv._writeArray('remove_entity_effect', {
      entityId: entity.id,
      effectId: effectId
    }, sendTo);
  };

  entity.addEffect = function (effectId) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var amp = typeof opt.amplifier == 'undefined' ? 0 : opt.amplifier;
    if (!entity.effects[effectId] || opt.override || amp < entity.effects[effectId].amplifier) {
      entity.effects[effectId] = {
        amplifier: opt.amplifier || 0,
        duration: opt.duration || 30 * 20,
        particles: opt.particles || true,
        end: Date.now() + (opt.duration || 30 * 20) * 1000 / 20, // 1000/20 == convert from ticks to milliseconds,
        timeout: setTimeout(function () {
          return entity.removeEffect(effectId);
        }, (opt.duration || 30 * 20) * 1000 / 20)
      };
      entity.sendEffect(effectId, opt);
      return true;
    } else return false;
  };

  entity.removeEffect = function (effectId, opt) {
    clearTimeout(entity.effects[effectId].timeout);
    entity.effects[effectId] = null;
    entity.sendRemoveEffect(effectId, opt);
  };
};

module.exports.player = function (player) {
  player.commands.add({
    base: 'effect',
    info: 'Give player an effect',
    usage: '/effect <player> <effect> [seconds] [amplifier] [hideParticles]',
    parse: function parse(str) {
      return str.match(/(.+?) (\d+)(?: (\d+))?(?: (\d+))?(?: (true|false))?|.*? clear/) || false;
    },
    action: function action(params) {
      var targets = player.selectorString(params[1]);
      if (params[2] == 'clear') {
        targets.forEach(function (e) {
          return (0, _keys2.default)(e.effects).forEach(function (effectId) {
            if (e.effects[effectId] != null) e.removeEffect(effectId);
          });
        });
      } else {
        targets.forEach(function (e) {
          var effId = parseInt(params[2]);
          if (e.effects[effId]) {
            e.removeEffect(effId);
          }
          e.addEffect(effId, {
            amplifier: parseInt(params[4]) || 0,
            duration: parseInt(params[3]) * 20 || 30 * 20,
            particles: params[5] != 'true' // hidesParticles vs particles (i.e. "showParticles")
          });
        });
      }
      var chatSelect = targets.length == 1 ? targets[0].type == 'player' ? targets[0].username : 'entity' : 'entities';
      if (params[2] == 'clear') player.chat('Remove all effects from ' + chatSelect + '.');else player.chat('Gave ' + chatSelect + ' effect ' + params[2] + '(' + (params[4] || 0) + ') for ' + (parseInt(params[3]) || 30) + ' seconds');
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/effects.js.map
