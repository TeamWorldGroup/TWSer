'use strict';

const path = require('path');
const requireIndex = require('requireindex');

class Plugin {
	static load(options) {
		this.options = options;
		this.plugins = requireIndex(path.join(__dirname, 'plugins'));
		Object.keys(this.plugins).
			// filter((pluginName) => Boolean(this.plugins[pluginName].server)).
			forEach((pluginName) => this.plugins[pluginName].server(this, this.options));
	}
}

module.exports = Plugin;