'use strict';

const {EventEmitter} = require('events');
const Logger = require('./utils/logger');
const Protocol = require('./protocol');
const requireIndex = require('requireindex');
const path = require('path');
const Lang = require('./Lang');

const lang = new Lang('rus');

require('emit-then').register();

Error.stackTraceLimit = Infinity;

class Server extends EventEmitter {
	constructor(options = {}) {
		super(); {
			this.run = this.run.bind(this);
		}
		this.options = options;

		/* const mcServer = new MCServer();

		mcServer.connect(options);
		return mcServer;*/
	}

	run() {
		Logger.info(lang.translate('server-loadingplugins'));

		this.plugins = requireIndex(path.join(__dirname, 'plugins'));

		this._server = Protocol.createServer(this.options);

		Object.keys(this.plugins)
			.filter(pluginName => this.plugins[pluginName].server != undefined)
			.forEach(pluginName => this.plugins[pluginName].server(this, this.options));
		// if (this.options.logging == true) Logger.setLevels(['debug']);
		this._server.on('error', error => this.emit('error', error));
		this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port));
		this.emit('asap');

		Logger.success(lang.translate('server-started'));

		return this;
	}

	stop() {
		// TODO: Save
		Logger.warn(lang.translate('server-shutdown'));
		// TODO: Save logs
		process.exit(0);
	}

	static get version() {
		return require('./config.json').version;
	}
}

Server.Behavior = require('./behavior');
Server.Command = require('./Command');
Server.World = require('./world');
Server.Experience = require('./experience');
Server.UserError = require('./user_error');
Server.portalDetector = require('./structures/portal_detector');

module.exports = Server;