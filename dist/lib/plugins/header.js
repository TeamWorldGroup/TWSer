"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.player = function (player, serv, settings) {
  player.playerlistUpdateText = function (header, footer) {
    return player._client.write('playerlist_header', {
      header: (0, _stringify2.default)(header),
      footer: (0, _stringify2.default)(footer)
    });
  };

  player.playerlistUpdateText(settings["player-list-text"]["header"], settings["player-list-text"]["footer"]);
};
//# sourceMappingURL=../../maps/lib/plugins/header.js.map
