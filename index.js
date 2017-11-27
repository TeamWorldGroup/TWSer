const net = require("net");
const fs = require("fs");
const iclite = require('iconv-lite');
const crypto = require('crypto');
/*const protobuf = require('protocol-buffers')
const protocol = protobuf(fs.readFileSync("protocol.proto"));*/

function encodeString(s) {
  const buf1 = Buffer.allocUnsafe(2);
  const buf2 = iclite.encode(s, "utf16be");
  buf1.writeUInt16BE(buf2.length / 2, 0);
  return Buffer.concat([buf1, buf2]);
}

function kick(socket, reason) {
  const buf1 = Buffer.allocUnsafe(1);
  buf1.writeUInt8(0xFF); // Packet type - kick/disconnect
  const buf2 = encodeString(reason);
  socket.write(Buffer.concat([buf1, buf2]));
}

function handshakeReply(socket) {
  const buf1 = Buffer.allocUnsafe(1);
  buf1.writeUInt8(0x02); // Packet type - Handshake
  const buf2 = encodeString("-");
  socket.write(Buffer.concat([buf1, buf2]));
}

function loginPlayer(socket) {
  const buf1 = Buffer.allocUnsafe(5);
  buf1[0] = 0x01; // Packet type - Login
  buf1.writeUInt32BE(1, 1); // Player's EID
  const buf2 = encodeString(""); // ?
  const buf3 = encodeString("FLAT"); // World type (FLAT)
  const buf4 = Buffer.allocUnsafe(11);
  buf4.writeUInt32BE(1, 0); // Gamemode (1 == creative)
  buf4.writeUInt32BE(0, 4); // World (0 == Overworld)
  buf4.writeInt8(2, 8); // Normal difficulty
  buf4.writeUInt8(255, 10); // Max 255 players
  socket.write(Buffer.concat([buf1, buf2, buf3, buf4])); // Send

}

function allocateChunk(socket, x, y, state) {
  const buf = Buffer.allocUnsafe(10);
  buf[0] = 0x32; // Packet type - Chunk Alloc
  buf.writeUInt32BE(x, 1); // Chunk X
  buf.writeUInt32BE(y, 5); // Chunk Y
  buf[9] = state; // State
  socket.write(buf); // Send
}

function playerPos(socket, x, y, z, yaw, pitch) {
  const buf = Buffer.allocUnsafe(42);
  buf[0] = 0x0D;
  let offset = 1;
  buf.writeDoubleBE(x, offset);
  offset += 8;
  buf.writeDoubleBE(y + 1.8, offset);
  offset += 8;
  buf.writeDoubleBE(y, offset);
  offset += 8;
  buf.writeDoubleBE(z, offset);
  offset += 8;
  buf.writeFloatBE(yaw, offset);
  offset += 4;
  buf.writeFloatBE(pitch, offset);
  offset += 4;
  buf[offset] = 1;
  socket.write(buf);
}

function sendChunkData(socket, x, y) {
  const buf = Buffer.alloc(22);
  buf[0] = 0x33; // Packet type - Chunk Data
  buf.writeUInt32BE(x, 1);
  buf.writeUInt32BE(y, 5);
  buf[9] = 1;
  socket.write(buf);
}

function sendKeepAlive(socket) {
  /*const buf = Buffer.alloc(1);
  const rand = crypto.randomBytes(4);
  socket.write(Buffer.concat([buf, rand]));*/
}

const server = net.createServer(function (socket) {
  console.log("open socket");
  const interval = setInterval(sendKeepAlive.bind(this, socket), 1000);
  socket.on("data", (data) => {
    //console.log(data);
    if (data[0] == 0x02) { // Handshake
      const size = data.readUInt16BE(1);
      const str = iclite.decode(data.slice(3, 3 + size * 2), "utf16be");
      console.log(str.split(";")[0] + " connects...");
      handshakeReply(socket);
    } else if (data[0] == 0x01) { // Login
      console.log("login...");
      loginPlayer(socket);
      allocateChunk(socket, 0, 0, 1);
      sendChunkData(socket, 0, 0);
      playerPos(socket, 0, 0, 0, 0, 0); // TODO: keep alive
    }
  });
  socket.on("end", () => {
    clearInterval(interval);
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});

// grab an arbitrary unused port.
server.listen(25565, "0.0.0.0", () => {
  const addr = server.address();
  console.log('opened server on', addr.address + ":" + addr.port);
});