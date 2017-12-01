"use strict";

const Vec3 = require('vec3').Vec3;

module.exports = function /*init*/(types) {
    return function /*populate*/(chunk, chunkX, chunkZ, random) {
        for(const type of types) {
            for(let i = 0; i < type.clusterCount; i++) {
                let x = random.intBetween(chunkX << 4, (chunkX << 4) + 15);
                let y = random.intBetween(type.minHeight, type.maxHeight);
                let z = random.intBetween(chunkZ << 4, (chunkZ << 4) + 15);
                for(let i = 0; i < type.clusterSize; i++) {
                    if (chunk.getBlockType(new Vec3(x, y, z)) === 1) { // Stone
                        chunk.setBlockType(new Vec3(x, y, z), type.blockId);
                        chunk.setBlockData(new Vec3(x, y, z), type.blockData);
                    }
                    x += random.range(3) - 1;
                    y += random.range(3) - 1;
                    z += random.range(3) - 1;
                    if (x < 0 || x >= 16 || z < 0 || z >= 16 || y < 0 || y >= 256) {
                        break;
                    }
                }
            }
        }
    }
}