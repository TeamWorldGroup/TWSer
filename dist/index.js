'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mc = require('minecraft-protocol');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var requireIndex = require('requireindex');
require('emit-then').register();
if (process.env.NODE_ENV === 'dev') {
  require('longjohn');
}

module.exports = {
  createMCServer: createMCServer,
  Behavior: require("./lib/behavior"),
  Command: require("./lib/command"),
  version: require("./lib/version"),
  generations: require("./lib/generations"),
  experience: require("./lib/experience"),
  UserError: require("./lib/user_error"),
  portal_detector: require('./lib/portal_detector')
};

function createMCServer(options) {
  options = options || {};
  var mcServer = new MCServer();
  mcServer.connect(options);
  return mcServer;
}

var MCServer = function (_EventEmitter) {
  (0, _inherits3.default)(MCServer, _EventEmitter);

  function MCServer() {
    (0, _classCallCheck3.default)(this, MCServer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MCServer.__proto__ || (0, _getPrototypeOf2.default)(MCServer)).call(this));

    _this._server = null;
    return _this;
  }

  (0, _createClass3.default)(MCServer, [{
    key: 'connect',
    value: function connect(options) {
      var _this2 = this;

      var plugins = requireIndex(path.join(__dirname, 'lib', 'plugins'));
      this._server = mc.createServer(options);
      (0, _keys2.default)(plugins).filter(function (pluginName) {
        return plugins[pluginName].server != undefined;
      }).forEach(function (pluginName) {
        return plugins[pluginName].server(_this2, options);
      });
      if (options.logging == true) this.createLog();
      this._server.on('error', function (error) {
        return _this2.emit('error', error);
      });
      this._server.on('listening', function () {
        return _this2.emit('listening', _this2._server.socketServer.address().port);
      });
      this.emit('asap');
    }
  }]);
  return MCServer;
}(EventEmitter);
//# sourceMappingURL=maps/index.js.map
