'use strict';

class Generator {

	// Structures
	static tree({level, treeLevel, chunk, treeData, x, z}) {
		for (let y = level + 1; y <= level + 6; y++) {
            let block;
            const pos = new Vec3(x, y, z);

            if (y == treeLevel + 6 && x == 8 && z == 8) {
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
	}
}

module.exports = Generator;