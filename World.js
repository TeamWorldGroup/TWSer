const zlib = require('zlib');
const fs = require("fs");

class Chunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.blockBuffer = Buffer.alloc(16 * 16 * 256);
        this.dataBuffer = Buffer.alloc(16 * 16 * 128);
        this.lightBuffer = Buffer.alloc(16 * 16 * 128);
        this.skylightBuffer = Buffer.alloc(16 * 16 * 128);
        this.biomeBuffer = Buffer.alloc(256);
        this.generate();
        this.saveSync();
    }
    save() {
        fs.writeFile(`world/${this.x}_${this.y}.col`, this.buildBufferNotPacked(), () => {});
    }
    saveSync() {
        fs.writeFileSync(`world/${this.x}_${this.y}.col`, this.buildBufferNotPacked());
    }
    /*load() {
        fs.readFile(`world/${this.x}_${this.y}.col`, (data) => {

        });
    }*/
    generate() {
        let offset = 0;
        for(; offset < 16 * 16; offset++) {
            this.blockBuffer[offset] = 7;
        }
        for (; offset < 3 * 16 * 16; offset++) {
            this.blockBuffer[offset] = 3;
        }
        for (; offset < 4 * 16 * 16; offset++) {
            this.blockBuffer[offset] = 2;
        }
        offset = 0;
        for (; offset < 16 * 16 * 16; offset++) {
            this.lightBuffer[offset] = 0xFF;
            this.skylightBuffer[offset] = 0xFF;
        }
    }
    buildBufferNotPacked() {
        console.log(this.blockBuffer);
        const buffers = [];
        // for (let i = 0; i < 1; i++) {
        buffers.push(this.blockBuffer.slice(0, 16 * 16 * 16));
        buffers.push(this.dataBuffer.slice(0, 16 * 16 * 8));
        buffers.push(this.lightBuffer.slice(0, 16 * 16 * 8));
        buffers.push(this.skylightBuffer.slice(0, 16 * 16 * 8));
        //buffers.push(this.biomeBuffer);
        // }
        buffers.push(this.biomeBuffer);
        return Buffer.concat(buffers);
    }
    buildBuffer() {
        return zlib.deflateSync(this.buildBufferNotPacked());
    }
}

class World {
    constructor() {
        this.chunks = {};
        this.buildChunk = this.buildChunk.bind(this);
    }
    buildChunk(x, y) {
        if (!this.chunks[`${x}_${y}`]) {
            this.chunks[`${x}_${y}`] = new Chunk(x, y);
        }
        return this.chunks[`${x}_${y}`];
    }
}

module.exports = World;