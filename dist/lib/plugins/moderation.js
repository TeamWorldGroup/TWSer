"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require("moment");
var rp = require("request-promise");
var nodeUuid = require('node-uuid');

module.exports.server = function (serv) {

  serv.ban = function (uuid, reason) {
    serv.bannedPlayers[uuid] = {
      time: +moment(),
      reason: reason || "Your account is banned!"
    };
  };
  serv.banIP = function (IP, reason) {
    serv.bannedIPs[IP] = {
      time: +moment(),
      reason: reason || "Your IP is banned!"
    };
    (0, _keys2.default)(serv.players).filter(function (uuid) {
      return serv.players[uuid]._client.socket.remoteAddress == IP;
    }).forEach(function (uuid) {
      return serv.players[uuid].kick(serv.bannedIPs[serv.players[uuid]._client.socket.remoteAddress].reason);
    });
  };

  function uuidInParts(plainUUID) {
    return nodeUuid.unparse(nodeUuid.parse(plainUUID));
  }

  serv.getUUIDFromUsername = function (username) {
    return rp('https://api.mojang.com/users/profiles/minecraft/' + username).then(function (body) {
      if (!body) throw new Error("username not found");
      return uuidInParts(JSON.parse(body).id);
    }).catch(function (err) {
      throw err;
    });
  };

  serv.banUsername = function (username, reason) {
    return serv.getUUIDFromUsername(username).then(function (uuid) {
      return serv.ban(uuid, reason);
    });
  };

  serv.pardonUsername = function (username) {
    return serv.getUUIDFromUsername(username).then(pardon);
  };

  serv.pardonIP = function (IP) {
    return serv.bannedIPs[IP] ? delete serv.bannedIPs[IP] : false;
  };

  function pardon(uuid) {
    if (serv.bannedPlayers[uuid]) {
      delete serv.bannedPlayers[uuid];
      return true;
    }
    return false;
  }

  serv.bannedPlayers = {};
  serv.bannedIPs = {};
};

module.exports.player = function (player, serv) {
  player.kick = function () {
    var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "You were kicked!";
    return player._client.end(reason);
  };

  player.ban = function (reason) {
    reason = reason || "You were banned!";
    player.kick(reason);
    var uuid = player._client.uuid;
    serv.ban(uuid, reason);
  };
  player.banIP = function (reason) {
    reason = reason || "You were IP banned!";
    player.kick(reason);
    serv.banIP(player._client.socket.remoteAddress);
  };

  player.pardon = function () {
    return serv.pardon(player._client.uuid);
  };

  player.commands.add({
    base: 'kick',
    info: 'to kick a player',
    usage: '/kick <player> [reason]',
    op: true,
    parse: function parse(str) {
      if (!str.match(/([a-zA-Z0-9_]+)(?: (.*))?/)) return false;
      var parts = str.split(' ');
      return {
        username: parts.shift(),
        reason: parts.join(' ')
      };
    },
    action: function action(_ref) {
      var username = _ref.username,
          reason = _ref.reason;

      var kickPlayer = serv.getPlayer(username);
      if (!kickPlayer) {
        player.chat(username + " is not on this server!");
      } else {
        kickPlayer.kick(reason);
        kickPlayer.emit("kicked", player, reason);
      }
    }
  });

  player.commands.add({
    base: 'ban',
    info: 'to ban a player',
    usage: '/ban <player> [reason]',
    op: true,
    parse: function parse(str) {
      if (!str.match(/([a-zA-Z0-9_]+)(?: (.*))?/)) return false;
      var parts = str.split(' ');
      return {
        username: parts.shift(),
        reason: parts.join(' ')
      };
    },
    action: function action(_ref2) {
      var username = _ref2.username,
          reason = _ref2.reason;

      var banPlayer = serv.getPlayer(username);

      if (!banPlayer) {
        serv.banUsername(username, reason).then(function () {
          serv.emit('banned', player, username, reason);
          player.chat(username + ' was banned');
        }).catch(function (err) {
          return player.chat(username + " is not a valid player!");
        });
      } else {
        banPlayer.ban(reason);
        serv.emit("banned", player, username, reason);
      }
    }
  });

  player.commands.add({
    base: 'ban-ip',
    info: 'bans a specific IP',
    usage: '/ban-ip <ip> [reason]',
    op: true,
    parse: function parse(str) {
      var argv = str.split(' ');
      if (argv.length < 1) return;

      return {
        IP: argv.shift(),
        reason: argv.shift()
      };
    },
    action: function action(_ref3) {
      var IP = _ref3.IP,
          reason = _ref3.reason;

      serv.banIP(IP, reason);
      player.chat("" + IP + " was IP banned");
    }
  });

  player.commands.add({
    base: 'pardon-ip',
    info: 'to pardon a player by ip',
    usage: '/pardon-ip <ip>',
    op: true,
    action: function action(IP) {
      var result = serv.pardonIP(IP);
      player.chat(result ? IP + " was IP pardoned" : IP + " is not banned");
    }
  });

  player.commands.add({
    base: 'pardon',
    info: 'to pardon a player',
    usage: '/pardon <player>',
    op: true,
    parse: function parse(str) {
      if (!str.match(/([a-zA-Z0-9_]+)/)) return false;
      return str;
    },
    action: function action(nick) {
      serv.pardonUsername(nick).then(function () {
        return player.chat(nick + " is unbanned");
      }).catch(function (err) {
        return player.chat(nick + " is not banned");
      });
    }
  });

  player.commands.add({
    base: 'op',
    info: 'op any player',
    usage: '/op <player>',
    op: true,
    parse: function parse(str) {
      if (!str.match(/([a-zA-Z0-9_]+)/)) return false;
      return str;
    },
    action: function action(username) {
      var user = serv.getPlayer(username);
      if (!user) return 'That player is not on the server.';
      user.op = true;
      player.chat(username + ' is opped');
    }
  });

  player.commands.add({
    base: 'deop',
    info: 'deop any player',
    usage: '/deop <player>',
    op: true,
    parse: function parse(str) {
      if (!str.match(/([a-zA-Z0-9_]+)/)) return false;
      return str;
    },
    action: function action(username) {
      var user = serv.getPlayer(username);
      if (!user) return 'That player is not on the server.';
      user.op = false;
      player.chat(username + ' is deopped');
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/moderation.js.map
