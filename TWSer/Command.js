'use strict';

const Commands = {};

class Command {
	constructor(name, func) {
		if (typeof name !== 'string') throw new Error('name must be a String');
		if (typeof func !== 'function') throw new Error('func must be a Function');

		this.name = name;
		this.func = func;
	}

	run(){
		return this.func();
	}

	static add(command /* Command */) {
		if (command instanceof Command) throw new Error('command must be a Command');
		Commands[command.name] = command.func;
	}
}

module.exports = Command;