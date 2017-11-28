const EventEmitter = require("events").EventEmitter;

class GlobalAPI extends EventEmitter {
    constructor() {
        super();
        this.apis = [];
        this.time = 0;
        this.players = [];
        setInterval(() => this.time++, 50);
    }
    forEach(func) {
        this.apis.forEach(func);
    }
    forEachPlayer(func) {
        this.players.forEach(func);
    }
    add(api) {
        this.apis.push(api);
    }
    addPlayer(player) {
        this.players.push(player);
    }
    remove(api) {
        const idx = this.apis.indexOf(api);
        if(idx >= 0) {
            this.apis.splice(idx);
        }
    }
    removePlayer(player) {
        const idx = this.players.indexOf(player);
        if (idx >= 0) {
            this.players.splice(idx);
        }
    }
}

module.exports = GlobalAPI;