const net = require("net");
const fs = require("fs");
const iclite = require('iconv-lite');
const crypto = require('crypto');
const ServerAPI = require("./ServerAPI");
const Player = require("./Player");
const GlobalAPI = require("./GlobalAPI");
const globalAPI = new GlobalAPI();

const server = net.createServer(function (socket) {
  console.log("open socket");
  //const interval = setInterval(sendKeepAlive.bind(this, socket), 1000);
  const api = new ServerAPI(socket, globalAPI);
  let player;
  api.on("handshake", (data) => {
    /*const size = data.readUInt16BE(0);
    const str = iclite.decode(data.slice(2, 2 + size * 2), "utf16be");
    console.log(str.split(";")[0] + " connects...");
    api.handshakeReply();*/
    player = new Player(api);
    player.login(data);
  });

  api.on("ping", (data) => {
    api.kick("§1\00078\0001.6.4\0TWSer PC\0000\00020000");
  });
      
  api.on("login", (data) => {
    /*console.log("login...");
    player = new Player(api);
    player.login(data);
    /*api.loginPlayer();
    api.allocateChunk(0, 0, 1);
    api.sendChunkData(0, 0);
    setInterval(() => {
      api.setPlayerPos(0, 128, 0, 0, 0);
    }, 1000);*/
  });
}).on('error', (err) => {
  // handle errors here
  //throw err;
});

// grab an arbitrary unused port.
server.listen(25565, "0.0.0.0", () => {
  const addr = server.address();
  console.log('opened server on', addr.address + ":" + addr.port);
});