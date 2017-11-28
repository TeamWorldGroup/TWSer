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
    getWorld() {
        return this.globalAPI.world;
    }
    sendBuffer(data) {
        try {
            this.socket.write(data);
        } catch(e) {
            this.globalAPI.remove(this);
        }
    }
    setTime(time) {
        const buf = Buffer.alloc(17);
        buf[0] = 0x04;
        buf.writeUInt32BE(time, 13);
        this.sendBuffer(buf);
    }
    receivePacket(buf) {
        //console.log(buf.toString("hex").replace(/(.{2})/g, "$1 "));
        const type = buf[0];
        this.emit("generic", buf.slice(1), buf[0]);
        switch(type) {
            case 0x01:
                this.emit("login", buf.slice(1));
            break;
            case 0x02:
                this.emit("handshake", buf.slice(1));
                break;
            case 0x03:
                this.emit("chat", this.decodeString(buf.slice(1), 0).str);
                break;

            case 0x0A:
            break;
            case 0x0C:
                const yaw1 = buf.readFloatBE(1);
                const pitch1 = buf.readFloatBE(5);
                this.emit("turn", {
                    yaw: yaw1, pitch: pitch1
                });
            break;
            case 0x0D:
                const yaw = buf.readFloatBE(29);
                const pitch = buf.readFloatBE(33);
                this.emit("turn", {
                    yaw, pitch
                });
            case 0x0B:
                const x = buf.readDoubleBE(1);
                const y = buf.readDoubleBE(9);
                const z = buf.readDoubleBE(25);
                this.emit("move", {
                    x, y, z
                });
            break;
            case 0x0F:
                this.emit("setBlock", buf.slice(1));
            break;
            case 0xFE:
                this.emit("ping", buf.slice(1));
                this.globalAPI.remove(this);
                this.socket.end();
            break;
        }
    }
    decodeString(buf, ofs) {
        const size = buf.readUInt16BE(ofs);
        return {
            end: ofs + size * 2 + 2,
            str: iclite.decode(buf.slice(ofs + 2, ofs + 2 + size * 2), "utf16be")
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
    sendChat(object) {
        const buf1 = Buffer.allocUnsafe(1);
        buf1.writeUInt8(0x03); // Packet type - chat
        const buf2 = this.encodeString(JSON.stringify(object));
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
        buf.writeInt32BE(x, 1);
        buf.writeInt32BE(y, 5);
        buf[9] = 1;
        buf.writeUInt16BE(0x1, 10);
        const chunk = this.getWorld().buildChunk(x, y).buildBuffer();
        console.log(chunk);
        buf.writeUInt32BE(chunk.length, 14);
        this.sendBuffer(Buffer.concat([buf, chunk]));
    }
}

module.exports = ServerAPI;