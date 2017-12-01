'use strict';

const {EventEmitter} = require('events');
const Logger = require('./utils/logger');
const Protocol = require('./protocol');
const requireIndex = require('requireindex');
const path = require('path');

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
		this.plugins = requireIndex(path.join(__dirname, 'plugins'));

		this._server = Protocol.createServer(this.options);
		// FIXME: Start
		// region her
		/* const entity = require('./plugins/entities');
		const spawn = require('./plugins/spawn');
		const login = require('./plugins/login');
		const logout = require('./plugins/logout');
		const players = require('./plugins/players');
		const world = require('./plugins/world');
		const updatePositions = require('./plugins/updatePositions');
		const moderation = require('./plugins/moderation');


		this.plugins = {
			entity,
			spawn,
			login,
			logout,
			players,
			world,
			updatePositions,
			moderation
		};

		spawn.server(this, this.options);
		entity.server(this, this.options);
		players.server(this, this.options);
		login.server(this, this.options);
		logout.server(this, this.options);
		world.server(this, this.options);
		moderation.server(this, this.options); 
		*/

		// updatePosition.server(this, this.options);
		// endregion her
		// FIXME: End

		Object.keys(this.plugins)
			.filter(pluginName => this.plugins[pluginName].server != undefined)
			.forEach(pluginName => this.plugins[pluginName].server(this, this.options));
		// if (this.options.logging == true) Logger.setLevels(['debug']);
		this._server.on('error', error => this.emit('error', error));
		this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port));
		this.emit('asap');
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