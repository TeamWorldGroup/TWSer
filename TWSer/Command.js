'use strict';

const Logger = require('./utils/logger');
const assert = require('./utils/AntiStupid');

const Commands = {};

class Command {
	constructor(cmd, func) {
		assert.testType(cmd, 'string', 'cmd');
		assert.testType(func, 'function', 'func');

		this.cmd = cmd;
		this.func = func;
	}

	run() {
		return this.func();
	}

	static add(command /* Command */) {
		assert.test(command, Command, 'command');
		if (Commands[command.name]) Logger.warn(`Command ${command.name} already exists but will be rewrited!`, {'level': 'Command'});

		Commands[command.name] = command.func;
	}
}

module.exports = Command;