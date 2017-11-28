'use strict';

module.exports.server = function (serv) {
  serv.setTime = function (time) {
    serv.time = time;
    serv._writeAll('update_time', {
      age: [0, 0], // TODO
      time: [0, serv.time]
    });
  };

  serv.doDaylightCycle = true;

  serv.time = 0;

  serv.on('tick', function (delta, count) {
    if (!serv.doDaylightCycle) return;
    if (count % 20 == 0) {
      serv.behavior('changeTime', {
        old: serv.time,
        newTime: serv.time + 20
      }, function (_ref) {
        var newTime = _ref.newTime;

        serv.setTime(newTime % 24000); // Vanilla only does it every second
      });
    }
  });
};

module.exports.player = function (player, serv) {
  player.commands.add({
    base: 'night',
    info: 'to change a time to night',
    usage: '/night',
    op: true,
    action: function action() {
      return player.handleCommand('time set night');
    }
  });

  player.commands.add({
    base: 'time',
    info: 'to change a time',
    usage: '/time <add|query|set> <value>',
    op: true,
    parse: function parse(str) {
      var data = str.match(/^(add|query|set)(?: ([0-9]+|day|night))?/);
      if (!data) return false;
      return {
        action: data[1],
        value: data[2] == 'day' ? 1000 : data[2] == 'night' ? 13000 : parseInt(data[2])
      };
    },
    action: function action(_ref2) {
      var _action = _ref2.action,
          value = _ref2.value;

      if (_action == "query") {
        player.chat("It is " + serv.time);
      } else {
        var newTime = void 0;

        if (_action == "set") {
          newTime = value;
        } else if (_action == "add") {
          newTime = value + serv.time;
        }

        player.chat("Time was changed from " + serv.time + " to " + newTime);
        serv.setTime(newTime);
      }
    }
  });

  player.commands.add({
    base: 'day',
    info: 'to change a time to day',
    usage: '/day',
    op: true,
    action: function action() {
      return player.handleCommand('time set day');
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/daycycle.js.map
