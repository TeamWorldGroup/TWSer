'use strict';

var fs = require('fs');
var timeStarted = Math.floor(new Date() / 1000).toString();
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require("moment");

module.exports.server = function (serv, settings) {
  serv.on("error", function (error) {
    return serv.log('[ERR]: Server: ' + error.stack);
  });
  serv.on("clientError", function (client, error) {
    return serv.log('[ERR]: Client ' + client.socket.remoteAddress + ':' + client.socket.remotePort + ' : ' + error.stack);
  });

  serv.on("listening", function (port) {
    return serv.log('[INFO]: Server listening on port ' + port);
  });

  serv.on("banned", function (banner, bannedUsername, reason) {
    return serv.log(banner.username + " banned " + bannedUsername + (reason ? " (" + reason + ")" : ""));
  });

  serv.on("seed", function (seed) {
    return serv.log("seed: " + seed);
  });

  var logFile = path.join("logs", timeStarted + ".log");

  serv.log = function (message) {
    message = moment().format('MMMM Do YYYY, HH:mm:ss') + " " + message;
    if (!settings.noConsoleOutput) console.log(message);
    if (!settings.logging) return;
    fs.appendFile(logFile, message + "\n", function (err) {
      if (err) console.log(err);
    });
  };

  serv.createLog = function () {
    if (!settings.logging) return;
    mkdirp("logs", function (err) {
      if (err) {
        console.log(err);
        return;
      }

      fs.writeFile(logFile, "[INFO]: Started logging...\n", function (err) {
        if (err) console.log(err);
      });
    });
  };
};

module.exports.player = function (player, serv) {

  player.on("connected", function () {
    return serv.log("[INFO]: " + player.username + ' (' + player._client.socket.remoteAddress + ') connected');
  });

  player.on("spawned", function () {
    return serv.log("[INFO]: position written, player spawning...");
  });

  player.on("disconnected", function () {
    return serv.log("[INFO]: " + player.username + ' disconnected');
  });

  player.on("chat", function (_ref) {
    var message = _ref.message;
    return serv.log("[INFO] " + '<' + player.username + '>' + ' ' + message);
  });

  player.on("kicked", function (kicker, reason) {
    return serv.log(kicker.username + " kicked " + player.username + (reason ? " (" + reason + ")" : ""));
  });
};
//# sourceMappingURL=../../maps/lib/plugins/log.js.map
