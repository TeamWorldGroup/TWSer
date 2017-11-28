'use strict';

module.exports.server = function (serv) {
  serv.tickCount = 0;
  serv.lastTickTime = 0;

  serv.setTickInterval = function (ticksPerSecond) {
    serv.stopTickInterval();

    serv.tickInterval = setInterval(function () {
      serv.tickCount++;
      var t = Date.now();
      var time = (t - serv.lastTickTime) / 1000;
      if (time > 100) time = 0;
      serv.emit('tick', time, serv.tickCount);
      serv.lastTickTime = t;
    }, 1000 / ticksPerSecond);
  };

  serv.stopTickInterval = function () {
    if (serv.tickInterval) clearInterval(serv.tickInterval);
    serv.tickInterval = null;
  };

  serv.setTickInterval(20);
};
//# sourceMappingURL=../../maps/lib/plugins/tick.js.map
