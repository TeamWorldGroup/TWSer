'use strict';

const {EventEmitter} = require('events');
const Logger = require('./TWSer/utils/logger');

class Server extends EventEmitter {
	constructor(options = {}) {
		super(); {
			this.run = this.run.bind(this);
		}
		this._options = options;

		const mcServer = new MCServer();

		mcServer.connect(options);
		return mcServer;
	}
	run() {
		// const plugins = requireIndex(path.join(__dirname, 'lib', 'plugins'));

		this._server = mc.createServer(this.options);
		// Object.keys(plugins)
		// 	.filter(pluginName => plugins[pluginName].server != undefined)
		// 	.forEach(pluginName => plugins[pluginName].server(this, this.options));
		if (this.options.logging == true) Logger.setLevels(['debug']);
		this._server.on('error', error => this.emit('error', error));
		this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port));
		this.emit('asap');

	}
}

Server.Behavior = require('./TWSer/behavior');
Server.Command = require('./TWSer/Command');
Server.World = require('./TWSer/world');
Server.Experience = require('./TWSer/experience');
Server.UserError = require('./TWSer/user_error');
// Server.portalDetector = require('./lib/portal_detector');

module.exports = Server;