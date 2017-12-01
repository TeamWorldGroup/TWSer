"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Chunk = require('prismarine-chunk')("1.8");
var Vec3 = require('vec3').Vec3;
var rand = require('random-seed');
var Ore = require('./populators/Ore');

var DiamondSquare = function () {
  function DiamondSquare(size, roughness, seed) {
    (0, _classCallCheck3.default)(this, DiamondSquare);

    // public fields
    this.size = size;
    this.roughness = roughness;
    this.seed = seed;
    this.opCountN = 0;

    // private field
    this.data = [];
  }

  // public methods


  (0, _createClass3.default)(DiamondSquare, [{
    key: "value",
    value: function value(x, y, v) {
      x = parseInt(x);
      y = parseInt(y);
      if (typeof v != 'undefined') this.val(x, y, v);else return this.val(x, y);
    }
  }, {
    key: "val",


    // private methods
    value: function val(x, y, v) {
      if (typeof v != 'undefined') this.data[x + '_' + y] = Math.max(0.0, Math.min(1.0, v));else {
        if (x <= 0 || x >= this.size || y <= 0 || y >= this.size) return 0.0;

        if (this.data[x + '_' + y] == null) {
          this.opCountN++;
          var base = 1;
          while ((x & base) == 0 && (y & base) == 0) {
            base <<= 1;
          }if ((x & base) != 0 && (y & base) != 0) this.squareStep(x, y, base);else this.diamondStep(x, y, base);
        }
        return this.data[x + '_' + y];
      }
    }
  }, {
    key: "randFromPair",
    value: function randFromPair(x, y) {
      var xm7 = void 0,
          xm13 = void 0,
          xm1301081 = void 0,
          ym8461 = void 0,
          ym105467 = void 0,
          ym105943 = void 0;
      for (var i = 0; i < 80; i++) {
        xm7 = x % 7;
        xm13 = x % 13;
        xm1301081 = x % 1301081;
        ym8461 = y % 8461;
        ym105467 = y % 105467;
        ym105943 = y % 105943;
        //y = (i < 40 ? seed : x);
        y = x + this.seed;
        x += xm7 + xm13 + xm1301081 + ym8461 + ym105467 + ym105943;
      }

      return (xm7 + xm13 + xm1301081 + ym8461 + ym105467 + ym105943) / 1520972.0;
    }
  }, {
    key: "displace",
    value: function displace(v, blockSize, x, y) {
      return v + (this.randFromPair(x, y, this.seed) - 0.5) * blockSize * 2 / this.size * this.roughness;
    }
  }, {
    key: "squareStep",
    value: function squareStep(x, y, blockSize) {
      if (this.data[x + '_' + y] == null) {
        this.val(x, y, this.displace((this.val(x - blockSize, y - blockSize) + this.val(x + blockSize, y - blockSize) + this.val(x - blockSize, y + blockSize) + this.val(x + blockSize, y + blockSize)) / 4, blockSize, x, y));
      }
    }
  }, {
    key: "diamondStep",
    value: function diamondStep(x, y, blockSize) {
      if (this.data[x + '_' + y] == null) {
        this.val(x, y, this.displace((this.val(x - blockSize, y) + this.val(x + blockSize, y) + this.val(x, y - blockSize) + this.val(x, y + blockSize)) / 4, blockSize, x, y));
      }
    }
  }]);
  return DiamondSquare;
}();

function generation() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      seed = _ref.seed,
      _ref$worldHeight = _ref.worldHeight,
      worldHeight = _ref$worldHeight === undefined ? 96 : _ref$worldHeight,
      _ref$waterline = _ref.waterline,
      waterline = _ref$waterline === undefined ? 64 : _ref$waterline;

  // Selected empirically
  var size = 10000000;
  var space = new DiamondSquare(size, size / 500, seed);
  var biomeSpace = new DiamondSquare(size, size / 100, seed + 1);
  var orePopulator = Ore([{
    blockId: 16,
    blockData: 0,
    clusterCount: 20,
    clusterSize: 16,
    minHeight: 0,
    maxHeight: 128
  }, {
    blockId: 15,
    blockData: 0,
    clusterCount: 20,
    clusterSize: 8,
    minHeight: 0,
    maxHeight: 64
  }, {
    blockId: 73,
    blockData: 0,
    clusterCount: 8,
    clusterSize: 7,
    minHeight: 0,
    maxHeight: 16
  }, {
    blockId: 21,
    blockData: 0,
    clusterCount: 1,
    clusterSize: 6,
    minHeight: 0,
    maxHeight: 32
  }, {
    blockId: 14,
    blockData: 0,
    clusterCount: 2,
    clusterSize: 8,
    minHeight: 0,
    maxHeight: 32
  }, {
    blockId: 56,
    blockData: 0,
    clusterCount: 1,
    clusterSize: 7,
    minHeight: 0,
    maxHeight: 16
  }, {
    blockId: 3,
    blockData: 0,
    clusterCount: 20,
    clusterSize: 32,
    minHeight: 0,
    maxHeight: 128
  }, {
    blockId: 13,
    blockData: 0,
    clusterCount: 10,
    clusterSize: 16,
    minHeight: 0,
    maxHeight: 128
  }]);

  function generateSimpleChunk(chunkX, chunkZ) {
    var chunk = new Chunk();
    var seedRand = rand.create(seed + ':' + chunkX + ':' + chunkZ);

    var worldX = chunkX * 16 + size / 2;
    var worldZ = chunkZ * 16 + size / 2;
    var treeRand = seedRand(3);
    var treeLevel = Math.floor(space.value(worldX + 8, worldZ + 8) * worldHeight);
    var treeData = 0;
    switch (seedRand(2)) {
      case 1:
        treeData = 2;break;
    }

    var treeBiome = Math.round(biomeSpace.value(worldX + 8, worldZ + 8));
    var treeTopPartRand = seedRand(2);

    for (var x = 0; x < 16; x++) {
      for (var z = 0; z < 16; z++) {
        var level = Math.floor(space.value(worldX + x, worldZ + z) * worldHeight);
        //level += 4;
        var biome = Math.round(biomeSpace.value(worldX + x, worldZ + z));
        var dirtheight = level - 4 + seedRand(3);
        var bedrockheight = 1 + seedRand(4);
        if (treeRand == 0 && treeLevel >= waterline && treeRand == 0 && treeBiome != 1) for (var y = level + 1; y <= level + 6; y++) {
          var block = void 0;
          var pos = new Vec3(x, y, z);
          if (y == treeLevel + 6 && x == 8 && z == 8) {
            block = 18;
          } else if (x == 8 && z == 8) {
            block = 17;
          } else if (treeTopPartRand == 0 && y == treeLevel + 6 && (x == 7 && z == 8 || x == 9 && z == 8 || x == 8 && z == 7 || x == 8 && z == 9)) {
            block = 18;
          } else if (y == treeLevel + 5 && x >= 7 && x <= 9 && z >= 7 && z <= 9) {
            block = 18;
          } else if (y <= treeLevel + 4 && y >= treeLevel + 3 && x >= 6 && x <= 10 && z >= 6 && z <= 10 && !((y == treeLevel + 3 ? seedRand(2) == 0 : true) && (x == 6 || x == 10) && (z == 6 || z == 10))) {
            block = 18;
          }
          if (block) chunk.setBlockType(pos, block);
          chunk.setBlockData(pos, treeData);
        }
        for (var _y = 0; _y < 256; _y++) {
          var _block = void 0;
          var data = void 0;

          var surfaceblock = level < waterline || biome == 1 ? 12 : 2; // Sand below water, grass
          var belowblock = level < waterline || biome == 1 ? 12 : 3; // 3-5 blocks below surface

          if (_y < bedrockheight) _block = 7; // Solid bedrock at bottom
          else if (_y < level && _y >= dirtheight) _block = belowblock; // Dirt/sand below surface
            else if (_y < level) {
                _block = 1; // Set stone inbetween
                /*const rand = seedRand(10);
                switch(rand) {
                  case 0: block = 16; break;
                  case 1: block = 15; break;
                  case 2: block = 21; break;
                  case 3: block = 14; break;
                  case 4: block = 56; break;
                  case 5: block = 73; break;
                }*/
              } else if (_y == level) {
                _block = surfaceblock; // Set surface sand/grass
                if (x == 8 && z == 8 && treeRand == 0) {
                  _block = belowblock;
                }
              } else if (_y <= waterline) _block = 9; // Set the water
              /*else if (y >= level+1 && level >= waterline && y <= level + 5 && treeRand == 0) {
                block = 17;
                data = 0;
              }*/
              else if (biome != 1 && _y == level + 1 && level >= waterline && seedRand(10) == 0 && !(x == 8 && z == 8 && treeRand == 0)) {
                  // 1/10 chance of grass
                  _block = 31;
                  data = 1;
                }

          var _pos = new Vec3(x, _y, z);
          if (_block) chunk.setBlockType(_pos, _block);
          if (data) chunk.setBlockData(_pos, data);
          chunk.setSkyLight(_pos, 15);
          switch (biome) {
            case 0:
              chunk.setBiome(_pos, 1);
              break;
            case 1:
              chunk.setBiome(_pos, 2);
              break;
          }
        }
      }
    }
    orePopulator(chunk, chunkX, chunkZ, seedRand);

    return chunk;
  }
  return generateSimpleChunk;
}

module.exports = generation;
//# sourceMappingURL=../../../maps/lib/worldGenerations/diamond-square/index.js.map
