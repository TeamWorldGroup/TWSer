"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require('vec3').Vec3;

module.exports = function ( /*init*/types) {
    return function ( /*populate*/chunk, chunkX, chunkZ, random) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(types), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var type = _step.value;

                for (var i = 0; i < type.clusterCount; i++) {
                    var x = random.intBetween(chunkX << 4, (chunkX << 4) + 15);
                    var y = random.intBetween(type.minHeight, type.maxHeight);
                    var z = random.intBetween(chunkZ << 4, (chunkZ << 4) + 15);
                    for (var _i = 0; _i < type.clusterSize; _i++) {
                        if (chunk.getBlockType(new Vec3(x, y, z)) === 1) {
                            // Stone
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
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };
};
//# sourceMappingURL=../../../../maps/lib/worldGenerations/diamond-square/populators/Ore.js.map
