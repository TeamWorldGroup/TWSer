'use strict';

var UserError = require('flying-squid').UserError;

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'weather',
    info: 'Sets the weather.',
    usage: '/weather <clear|rain>',
    op: true,
    parse: function parse(str) {
      var args = str.split(' ');
      if (args.length != 1) return false;

      var condition = args[0];
      if (["clear", "rain"].indexOf(condition) == -1) return false;

      return { condition: condition };
    },
    action: function action(_ref) {
      var condition = _ref.condition;

      if (condition == 'rain') {
        serv._writeAll('game_state_change', { reason: 2, gameMode: 0 });
      } else if (condition == 'clear') {
        serv._writeAll('game_state_change', { reason: 1, gameMode: 0 });
      }
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/weather.js.map
