'use strict';

var Vec3 = require("vec3").Vec3;

module.exports.server = function (serv) {
  serv.emitParticle = function (particle, world, position) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        whitelist = _ref.whitelist,
        _ref$blacklist = _ref.blacklist,
        blacklist = _ref$blacklist === undefined ? [] : _ref$blacklist,
        _ref$radius = _ref.radius,
        radius = _ref$radius === undefined ? 32 * 32 : _ref$radius,
        _ref$longDistance = _ref.longDistance,
        longDistance = _ref$longDistance === undefined ? true : _ref$longDistance,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? new Vec3(1, 1, 1) : _ref$size,
        _ref$count = _ref.count,
        count = _ref$count === undefined ? 1 : _ref$count;

    var players = typeof whitelist != 'undefined' ? whitelist instanceof Array ? whitelist : [whitelist] : serv.getNearby({
      world: world,
      position: position.scaled(32).floored(),
      radius: radius // 32 blocks, fixed position
    });

    serv._writeArray('world_particles', {
      particleId: particle,
      longDistance: longDistance,
      x: position.x,
      y: position.y,
      z: position.z,
      offsetX: size.x,
      offsetY: size.y,
      offsetZ: size.z,
      particleData: 1.0,
      particles: count,
      data: []
    }, players.filter(function (p) {
      return blacklist.indexOf(p) == -1;
    }));
  };
};

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'particle',
    info: 'emit a particle at a position',
    usage: '/particle <id> [amount] [<sizeX> <sizeY> <sizeZ>]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/(\d+)(?: (\d+))?(?: (\d+))?(?: (\d+))?(?: (\d+))?(?: (\d+))?/);
      if (!results) return false;
      return {
        particle: parseInt(results[1]),
        amount: results[2] ? parseInt(results[2]) : 1,
        size: results[5] ? new Vec3(parseInt(results[3]), parseInt(results[4]), parseInt(results[5])) : new Vec3(1, 1, 1)
      };
    },
    action: function action(_ref2) {
      var particle = _ref2.particle,
          amount = _ref2.amount,
          size = _ref2.size;

      if (amount >= 100000) {
        player.chat('You cannot emit more than 100,000 particles!');
        return;
      }
      player.chat('Emitting "' + particle + '" (count: ' + amount + ', size: ' + size.toString() + ')');
      serv.emitParticle(particle, player.world, player.position.scaled(1 / 32), { count: amount, size: size });
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/particle.js.map
