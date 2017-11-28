'use strict';

var Chunk = require('prismarine-chunk')(require("../version"));
var Vec3 = require('vec3').Vec3;
var rand = require('random-seed');

function generation() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      seed = _ref.seed,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? 50 : _ref$level;

  function generateChunk(chunkX, chunkZ) {
    var seedRand = rand.create(seed + ':' + chunkX + ':' + chunkZ);
    var chunk = new Chunk();
    for (var x = 0; x < 16; x++) {
      for (var z = 0; z < 16; z++) {
        var bedrockheighttop = 1 + seedRand(4);
        var bedrockheightbottom = 1 + seedRand(4);
        for (var y = 0; y < 128; y++) {
          // Nether only goes up to 128
          var block = void 0;
          var data = void 0;

          if (y < bedrockheightbottom) block = 7;else if (y < level) block = 87;else if (y > 127 - bedrockheighttop) block = 7;

          var pos = new Vec3(x, y, z);
          if (block) chunk.setBlockType(pos, block);
          if (data) chunk.setBlockData(pos, data);
          // Don't need to set light data in nether
        }
      }
    }
    return chunk;
  }
  return generateChunk;
}

module.exports = generation;
//# sourceMappingURL=../../maps/lib/worldGenerations/nether.js.map
