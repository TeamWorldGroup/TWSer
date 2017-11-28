'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Chunk = require('prismarine-chunk')(require("../version"));
var Vec3 = require('vec3').Vec3;
var blocks = require("minecraft-data")(require("../version")).blocks;

function generation() {
  function generateSimpleChunk() {
    var chunk = new Chunk();

    var i = 2;
    for (var x = 0; x < 16; x++) {
      for (var z = 0; z < 16; z++) {
        var y = void 0;
        for (y = 47; y <= 50; y++) {
          chunk.setBlockType(new Vec3(x, y, z), i);
          i = (i + 1) % (0, _keys2.default)(blocks).length;
        }
        for (y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15);
        }
      }
    }
    return chunk;
  }
  return generateSimpleChunk;
}

module.exports = generation;
//# sourceMappingURL=../../maps/lib/worldGenerations/all_the_blocks.js.map
