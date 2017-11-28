"use strict";

module.exports.player = function (player) {
  player._client.on('client_command', function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        payload = _ref.payload;

    if (payload == 1) {
      //WIP: dummy
      player.system("WIP, press ESC");
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/stats.js.map
