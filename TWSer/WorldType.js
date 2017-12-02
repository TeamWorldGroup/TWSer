'use strict';

class WorldType {
	constructor(name, generator, params = {}) {
		// assert name string
		// assert generator function

		this.name = name;
		this.generate = generator.bind(this);
		this.params = params;
	}
}

module.exports = WorldType;