const iclite = require("iconv-lite");

const fs = require("fs");
const EventEmitter = require("events").EventEmitter;

class ServerAPI extends EventEmitter {
    constructor(socket, gapi) {
        super();
        this.socket = socket;
        this.globalAPI = gapi;
        socket.on("data", this.receivePacket.bind(this));
        gapi.add(this);
        const self = this;
        socket.on("end", function() {
            gapi.remove(self);
        });
    }
    sendBuffer(data) {
        console.log(data.toString("hex").replace(/(.{2})/g, "$1 "));
        this.socket.write(data);
    }
    receivePacket(buf) {
        const type = buf[0];
        this.emit("generic", buf.slice(1), buf[0]);
        switch(type) {
            case 0x01:
                this.emit("login", buf.slice(1));
            break;
            case 0x02:
                this.emit("handshake", buf.slice(1));
            break;
            case 0xFE:
                this.emit("ping", buf.slice(1));
                this.globalAPI.remove(this);
                this.socket.end();
            break;
        }
    }
    encodeString(s) {
        const buf1 = Buffer.allocUnsafe(2);
        const buf2 = iclite.encode(s, "utf16be");
        buf1.writeUInt16BE(buf2.length / 2, 0);
        return Buffer.concat([buf1, buf2]);
    }
    kick(reason) {
        const buf1 = Buffer.allocUnsafe(1);
        buf1.writeUInt8(0xFF); // Packet type - kick/disconnect
        const buf2 = this.encodeString(reason);
        this.sendBuffer(Buffer.concat([buf1, buf2]));
    }
    sendChat(text) {
        const buf1 = Buffer.allocUnsafe(1);
        buf1.writeUInt8(0x03); // Packet type - chat
        const buf2 = this.encodeString(text);
        this.sendBuffer(Buffer.concat([buf1, buf2]));
    }
    handshakeReply() {
        const buf1 = Buffer.allocUnsafe(1);
        buf1.writeUInt8(0x02); // Packet type - Handshake
        const buf2 = this.encodeString("-");
        this.sendBuffer(Buffer.concat([buf1, buf2]));
    }
    loginPlayer() {
        const buf1 = Buffer.allocUnsafe(5);
        buf1[0] = 0x01; // Packet type - Login
        buf1.writeUInt32BE(1, 1); // Player's EID
        const buf2 = this.encodeString("flat"); // Flat world
        const buf4 = Buffer.allocUnsafe(5);
        buf4.writeInt8(1, 0); // Gamemode (1 == creative)
        buf4.writeInt8(0, 1); // World (0 == Overworld)
        buf4.writeInt8(2, 2); // Normal difficulty
        buf4.writeUInt8(255, 4); // Max 255 players
        this.sendBuffer(Buffer.concat([buf1, buf2, buf4])); // Send

    }
    allocateChunk(x, y, state) {
        const buf = Buffer.allocUnsafe(10);
        buf[0] = 0x32; // Packet type - Chunk Alloc
        buf.writeUInt32BE(x, 1); // Chunk X
        buf.writeUInt32BE(y, 5); // Chunk Y
        buf[9] = state; // State
        this.sendBuffer(buf); // Send
    }
    setPlayerPos(x, y, z, yaw, pitch) {
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
        this.sendBuffer(buf);
    }
    sendChunkData(x, y) {
        const buf = Buffer.alloc(18);
        buf[0] = 0x33; // Packet type - Chunk Data
        buf.writeUInt32BE(x, 1);
        buf.writeUInt32BE(y, 5);
        buf[9] = 1;
        this.sendBuffer(buf);
    }
}

module.exports = ServerAPI;