const iclite = require("iconv-lite");

class Player {
    constructor(api) {
        this.api = api;
    }
    login(data) {
        const size = data.readUInt16BE(1);
        this.username = iclite.decode(data.slice(3, 3 + size * 2), "utf16be");
        this.api.on("chat", (data) => {
            console.log(`<${this.username}> ${data}`)
            this.api.globalAPI.forEach((api) => api.sendChat({
                "translate": "chat.type.text",
                "using": [this.username, data] 
            }));
        });
        this.api.loginPlayer();
        //this.api.allocateChunk(0, 0, 1);
        this.api.sendChunkData(0, 0);
        this.api.setPlayerPos(0, 128, 0, 0, 0);
        this.api.globalAPI.forEach((api)=>api.sendChat({text: this.username + " joined the game"}));
    }
};

module.exports = Player;