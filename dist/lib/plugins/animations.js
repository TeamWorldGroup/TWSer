"use strict";

module.exports.player = function (player) {
  player._client.on("arm_animation", function () {
    return player.behavior('punch', {}, function () {
      player._writeOthersNearby("animation", {
        entityId: player.id,
        animation: 0
      });
    });
  });

  player._client.on("entity_action", function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        actionId = _ref.actionId;

    if (actionId == 3) {
      player.setAndUpdateMetadata([{ "key": 0, "type": 0, "value": 0x08 }]);
    } else if (actionId == 4) {
      player.setAndUpdateMetadata([{ "key": 0, "type": 0, "value": 0x00 }]);
    } else if (actionId == 0) {
      player.setAndUpdateMetadata([{ "key": 0, "type": 0, "value": 0x02 }]);
      player.crouching = true;
    } else if (actionId == 1) {
      player.setAndUpdateMetadata([{ "key": 0, "type": 0, "value": 0x00 }]);
      player.crouching = false;
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/animations.js.map
