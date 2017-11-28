const EventEmitter = require("events").EventEmitter;

class GlobalAPI extends EventEmitter {
    constructor() {
        super();
        this.apis = [];
        this.time = 18000;
        setInterval(() => this.time++, 50);
    }
    forEach(func) {
        this.apis.forEach(func);
    }
    add(api) {
        this.apis.push(api);
    }
    remove(api) {
        const idx = this.apis.indexOf(api);
        if(idx >= 0) {
            this.apis.splice(idx);
        }
    }
}

module.exports = GlobalAPI;