const iclite = require("iconv-lite");

class Player {
    constructor(api) {
        this.api = api;
    }
    login(data) {
        const size = data.readUInt16BE(4);
        this.username = iclite.decode(data.slice(6, 6 + size * 2), "utf16be");
        this.api.loginPlayer();
        this.api.allocateChunk(0, 0, 1);
        this.api.sendChunkData(0, 0);
        this.api.setPlayerPos(0, 128, 0, 0, 0);
        this.api.globalAPI.forEach((api)=>api.sendChat(this.username + " joined the game"));
    }
};

module.exports = Player;