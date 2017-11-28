'use strict';

module.exports.server = function (serv) {
  serv.entityMaxId = 0;
  serv.players = [];
  serv.uuidToPlayer = {};
  serv.entities = {};

  serv.getPlayer = function (username) {
    var found = serv.players.filter(function (pl) {
      return pl.username == username;
    });
    if (found.length > 0) return found[0];
    return null;
  };
};

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'gamemode',
    aliases: ['gm'],
    info: 'to change game mode',
    usage: '/gamemode <0-3>',
    op: true,
    parse: function parse(str) {
      var results = void 0;
      if (!(results = str.match(/^([0-3])$/))) return false;
      return parseInt(str);
    },
    action: function action(mode) {
      player.setGameMode(mode);
    }
  });

  player.commands.add({
    base: 'difficulty',
    aliases: ['diff'],
    info: 'Sets the difficulty level',
    usage: '/difficulty <difficulty>',
    op: true,
    parse: function parse(str) {
      var results = void 0;
      if (!(results = str.match(/^([0-3])$/))) return false;
      return parseInt(str);
    },
    action: function action(diff) {
      serv._writeAll('difficulty', { difficulty: diff });
      serv.difficulty = diff;
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/players.js.map
