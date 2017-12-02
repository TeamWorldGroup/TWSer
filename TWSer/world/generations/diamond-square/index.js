'use strict';

const Chunk = require('prismarine-chunk')(require('../../../config.json').version);
const {Vec3} = require('vec3');
const rand = require('random-seed');

const DiamondSquare = require('./diamondSquare');
const Generator = require('./Generator');

function generate({
  seed,
  worldHeight = 96,
  waterline = 64
} = {}) {
  // Selected empirically
  const size = 10000000;
  const space = new DiamondSquare(size, size / 500, seed);
  const biomeSpace = new DiamondSquare(size, size / 100, seed + 1);

  function generateSimpleChunk(chunkX, chunkZ) {
    const chunk = new Chunk();
    const seedRand = rand.create(`${seed}:${chunkX}:${chunkZ}`);

    const [worldX, worldZ] = [(chunkX * 16) + (size / 2), (chunkZ * 16) + (size / 2)];

    const treeRand = seedRand(3);
    const treeLevel = Math.floor(space.value(worldX + 8, worldZ + 8) * worldHeight);
    const treeData = 0;
    /* switch (seedRand(2)) {
      case 1: treeData = 2; break;
    }*/

    const treeBiome = Math.round(biomeSpace.value(worldX + 8, worldZ + 8));

    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        const level = Math.floor(space.value(worldX + x, worldZ + z) * worldHeight);
        // level += 4;
        const biome = Math.round(biomeSpace.value(worldX + x, worldZ + z));
        const dirtheight = level - 4 + seedRand(3);
        const bedrockheight = 1 + seedRand(4);

        if (treeRand === 0 && treeLevel >= waterline && treeBiome !== 1)
          Generator.tree({
            level,
            treeLevel,
            chunk,
            treeData,
            x,
            z
          });
        for (let y = 0; y < 256; y++) {
          let block;
          let data;

          const surfaceblock = level < waterline || biome == 1 ? 12 : 2; // Sand below water, grass
          const belowblock = level < waterline || biome == 1 ? 12 : 3; // 3-5 blocks below surface

          if (y < bedrockheight) block = 7; // Solid bedrock at bottom
          else if (y < level && y >= dirtheight) block = belowblock; // Dirt/sand below surface
          else if (y < level) {
            block = 1; // Set stone inbetween
            const randm = seedRand(10);

            switch (randm) {
              case 0:
                block = 16;
                break;
              case 1:
                block = 15;
                break;
              case 2:
                block = 21;
                break;
              case 3:
                block = 14;
                break;
              case 4:
                block = 56;
                break;
              case 5:
                block = 73;
                break;
              default:
            }
          } else if (y == level) {
            block = surfaceblock; // Set surface sand/grass
            if (x == 8 && z == 8 && treeRand == 0) {
              block = belowblock;
            }
          } else if (y <= waterline) block = 9; // Set the water
          /* else if (y >= level+1 && level >= waterline && y <= level + 5 && treeRand == 0) {
      block = 17;
      data = 0;
      }*/
          else if (biome != 1 && y == level + 1 && level >= waterline && seedRand(10) == 0 && !(x == 8 && z == 8 && treeRand == 0)) { // 1/10 chance of grass
            block = 31;
            data = 1;
          }

          const pos = new Vec3(x, y, z);

          if (block) chunk.setBlockType(pos, block);
          if (data) chunk.setBlockData(pos, data);
          chunk.setSkyLight(pos, 15);
          switch (biome) {
            case 0:
              chunk.setBiome(pos, 1);
              break;
            case 1:
              chunk.setBiome(pos, 2);
              break;
            default:
          }
        }
      }
    }

    return chunk;
  }
  return generateSimpleChunk;
}


module.exports = generate;