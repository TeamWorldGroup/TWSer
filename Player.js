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
        this.api.on("turn", this.onTurn.bind(this));
        this.api.on("move", this.onMove.bind(this));
        this.api.on("setBlock", this.onSetBlock.bind(this));
        //this.api.on("posUpdate", this.updatePosition.bind(this));
        this.api.loginPlayer();
        //this.api.allocateChunk(0, 0, 1);
        this.api.sendChunkData(0, 0);
        this.api.globalAPI.addPlayer(this);
        this.x = 8;
        this.y = 4;
        this.z = 8;
        this.yaw = 0;
        this.pitch = 0;
        this.updatePosition();
        this.api.globalAPI.forEach((api)=>api.sendChat({text: this.username + " joined the game"}));
        
        //setInterval(() => this.updatePosition(), 1000)
        setInterval(() => this.api.setTime(this.api.globalAPI.time), 50);
    }
    onSetBlock(data) {
        const x = data.readInt32BE(0);
        const y = data.readUInt8(4);
        const z = data.readInt32BE(5);
    }
    updatePosition() {
        //console.log(this.x, this.y, this.z, this.yaw, this.pitch);
        this.api.setPlayerPos(this.x, this.y, this.z, this.yaw, this.pitch);
    }
    onTurn({yaw, pitch}) {
        this.yaw = yaw;
        this.pitch = pitch;
    }
    onMove({ x, y, z }) {
        const dist = Math.hypot(x - this.x, y - this.y, z - this.z);
        if(dist >= 100) {
            updatePosition();
            this.api.sendChat({text: "Stop cheating!"})
            return;
        }
        this.x = x;
        this.y = y;
        this.z = z;
    }
};

module.exports = Player;