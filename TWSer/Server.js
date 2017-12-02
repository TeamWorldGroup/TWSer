'use strict';

const {EventEmitter} = require('events');
const Logger = require('./utils/logger');
// const Protocol = require('./protocol');
const lang = new (require('./Lang'))('rus');

class Server extends EventEmitter {
	constructor(options = {}) {
		super();

		this.run = this.run.bind(this);

		this.options = options;

		this.name = 'Server';

		Server.Server = this;
	}

	run() {
		Logger.info(lang.translate('server-loadingplugins'));
		/*
				this._server = Protocol.createServer(this.options);

				this._server.on('error', error => this.emit('error', error));
				this._server.on('listening', () => this.emit('listening',
					this._server.socketServer.address().port));
				this.emit('asap');
		 */
		Logger.success(lang.translate('server-started'));

		return this;
	}

	stop() {
		this.emit('stop');
		// TODO: Save
		Logger.warn(lang.translate('server-shutdown'));
		// TODO: Save logs
		process.exit(0);
	}

	static get version() {
		return require('./config.json').version;
	}
}

// Server.Behavior = require('./behavior');
// Server.Command = require('./Command');
// Server.World = require('./world');
// Server.Experience = require('./experience');
// Server.UserError = require('./user_error');
// Server.portalDetector = require('./structures/portal_detector');

module.exports = Server;