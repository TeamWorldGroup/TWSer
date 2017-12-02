'use strict';

class World {
	constructor(name, folder, dimension, type /* WorldType */, seed /* Seed */) {
		this.type = type.name;
		this.name = name;
		this.folder = folder;
		this.spawnPosition = [0, 128, 0]; // TODO: Vec3

		type.generate(seed);
	}

	save(world /* World */){} // Чё я вообще творю такое? Пошел-ка я спать...
}

World.TYPE_FLAT =

module.exports = World;