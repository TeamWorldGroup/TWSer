"use strict";

module.exports.player = function (player, serv) {
  player._client.on("client_command", function (_ref) {
    var payload = _ref.payload;

    if (payload == 0) {
      player.behavior('requestRespawn', {}, function () {
        player._client.write("respawn", {
          dimension: 0,
          difficulty: serv.difficulty,
          gamemode: player.gameMode,
          levelType: 'default'
        });
        player.sendSelfPosition();
        player.updateHealth(20);
        player.nearbyEntities = [];
        player.updateAndSpawn();
      });
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/respawn.js.map
