const mc = require('./lib/protocol');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const requireIndex = require('requireindex');
require('emit-then').register();
if (process.env.NODE_ENV === 'dev'){
  require('longjohn');
}

class MCServer extends EventEmitter {
  constructor(options) {
    super();
    this._server = null;
    this.options = options;
  }

  connect() {
    const plugins = requireIndex(path.join(__dirname, 'lib', 'plugins'));
    this._server = mc.createServer(this.options);
    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].server!=undefined)
      .forEach(pluginName => plugins[pluginName].server(this, this.options));
    //if(this.options.logging == true) this.createLog();
    this._server.on('error', error => this.emit('error',error));
    this._server.on('listening', () => this.emit('listening',this._server.socketServer.address().port));
    this.emit('asap');
  }
}


module.exports = {
  MCServer,
  Behavior: require("./lib/behavior"),
  Command: require("./lib/command"),
  version: require("./lib/version"),
  generations: require("./lib/generations"),
  experience: require("./lib/experience"),
  UserError: require("./lib/user_error"),
  portal_detector: require('./lib/portal_detector')
};
