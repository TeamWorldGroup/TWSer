"use strict";

const Chunk = require('prismarine-chunk')("1.8");
const Vec3 = require('vec3').Vec3;
const rand = require('random-seed');

class DiamondSquare {
  constructor(size, roughness, seed) {
    // public fields
    this.size = size;
    this.roughness = roughness;
    this.seed = seed;
    this.opCountN = 0;

    // private field
    this.data = [];
  }

  // public methods
  value(x, y, v) {
    x = parseInt(x);
    y = parseInt(y);
    if (typeof(v) != 'undefined')
      this.val(x, y, v);
    else
      return this.val(x, y);
  };

  // private methods
  val(x, y, v) {
    if (typeof(v) != 'undefined')
      this.data[x + '_' + y] = Math.max(0.0, Math.min(1.0, v));
    else {
      if (x <= 0 || x >= this.size || y <= 0 || y >= this.size) return 0.0;

      if (this.data[x + '_' + y] == null) {
        this.opCountN++;
        let base = 1;
        while (((x & base) == 0) && ((y & base) == 0))
          base <<= 1;

        if (((x & base) != 0) && ((y & base) != 0))
          this.squareStep(x, y, base);
        else
          this.diamondStep(x, y, base);
      }
      return this.data[x + '_' + y];
    }
  }

  randFromPair(x, y) {
    let xm7,xm13,xm1301081,ym8461,ym105467,ym105943;
    for (let i = 0; i < 80; i++) {
      xm7 = x % 7;
      xm13 = x % 13;
      xm1301081 = x % 1301081;
      ym8461 = y % 8461;
      ym105467 = y % 105467;
      ym105943 = y % 105943;
      //y = (i < 40 ? seed : x);
      y = x + this.seed;
      x += (xm7 + xm13 + xm1301081 + ym8461 + ym105467 + ym105943);
    }

    return (xm7 + xm13 + xm1301081 + ym8461 + ym105467 + ym105943) / 1520972.0;
  }

  displace(v, blockSize, x, y) {
    return (v + (this.randFromPair(x, y, this.seed) - 0.5) * blockSize * 2 / this.size * this.roughness);
  }

  squareStep(x, y, blockSize) {
    if (this.data[x + '_' + y] == null) {
      this.val(x, y,
        this.displace((this.val(x - blockSize, y - blockSize) +
          this.val(x + blockSize, y - blockSize) +
          this.val(x - blockSize, y + blockSize) +
          this.val(x + blockSize, y + blockSize)) / 4, blockSize, x, y));
    }
  }

  diamondStep(x, y, blockSize) {
    if (this.data[x + '_' + y] == null) {
      this.val(x, y,
        this.displace((this.val(x - blockSize, y) +
          this.val(x + blockSize, y) +
          this.val(x, y - blockSize) +
          this.val(x, y + blockSize)) / 4, blockSize, x, y));
    }
  }
}

function generation({seed,worldHeight=128,waterline=64}={}) {
  // Selected empirically
  const size = 10000000;
  const space = new DiamondSquare(size, size / 500, seed);
  const biomeSpace = new DiamondSquare(size, size / 100, seed + 1);

  function generateSimpleChunk(chunkX, chunkZ) {
    const chunk = new Chunk();
    const seedRand = rand.create(seed+':'+chunkX+':'+chunkZ);

    const worldX = chunkX * 16 + size / 2;
    const worldZ = chunkZ * 16 + size / 2;
    const treeRand = seedRand(3);
    const treeLevel = Math.floor(space.value(worldX + 8, worldZ + 8) * worldHeight);
    let treeData = 0;
    switch (seedRand(2)) {
      case 1: treeData = 2; break;
    }

    const treeBiome = Math.round(biomeSpace.value(worldX + 8, worldZ + 8));

    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        const level = Math.floor(space.value(worldX + x, worldZ + z) * worldHeight);
        level += 4;
        const biome = Math.round(biomeSpace.value(worldX + x, worldZ + z));
        const dirtheight = level - 4 + seedRand(3);
        const bedrockheight = 1 + seedRand(4);
        if (treeRand == 0 && treeLevel >= waterline && treeRand == 0 && treeBiome != 1) for (let y = level + 1; y <= level + 6; y++) {
          let block;
          const pos = new Vec3(x, y, z);
          if(y == treeLevel + 6 && x == 8 && z == 8) {
            block = 18;
          } else if (x == 8 && z == 8) {
            block = 17;
          } else if (y == treeLevel + 5 && ((x == 7 && z == 8) || (x == 9 && z == 8) || (x == 8 && z == 7) || (x == 8 && z == 9))) {
            block = 18;
          } else if (y <= treeLevel + 4 && y >= treeLevel + 3 && x >= 6 && x <= 10 && z >= 6 && z <= 10 && !((x == 6 || x == 10) && (z == 6 || z == 10))) {
            block = 18;
          }
          if (block) chunk.setBlockType(pos, block);
          chunk.setBlockData(pos, treeData);
        }
        for (let y = 0; y < 256; y++) {
          let block;
          let data;

          const surfaceblock = level < waterline || biome == 1  ? 12 : 2; // Sand below water, grass
          const belowblock = level < waterline || biome == 1 ? 12 : 3; // 3-5 blocks below surface

          if (y < bedrockheight) block = 7; // Solid bedrock at bottom
          else if (y < level && y >= dirtheight) block = belowblock; // Dirt/sand below surface
          else if (y < level)  {
            block = 1; // Set stone inbetween
            const rand = seedRand(10);
            switch(rand) {
              case 0: block = 16; break;
              case 1: block = 15; break;
              case 2: block = 21; break;
              case 3: block = 14; break;
              case 4: block = 56; break;
              case 5: block = 73; break;
            }
          }
          else if (y == level) {
            block = surfaceblock; // Set surface sand/grass
            if (x == 8 && z == 8 && treeRand == 0) {
              block = belowblock;
            }
          }
          else if (y <= waterline) block = 9; // Set the water
          /*else if (y >= level+1 && level >= waterline && y <= level + 5 && treeRand == 0) {
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
          switch(biome) {
            case 0:
              chunk.setBiome(pos, 1);
            break;
            case 1:
              chunk.setBiome(pos, 2);
            break;
          }
        }
      }
    }

    return chunk;
  }
  return generateSimpleChunk;
}

module.exports=generation;
