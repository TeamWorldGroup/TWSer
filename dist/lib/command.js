'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Command = function () {
  function Command(params, parent, hash) {
    (0, _classCallCheck3.default)(this, Command);

    this.params = params;
    this.parent = parent;
    this.hash = parent ? parent.hash : {};
    this.uniqueHash = parent ? parent.uniqueHash : {};
    this.parentBase = this.parent && this.parent.base && this.parent.base + ' ' || '';
    this.base = this.parentBase + (this.params.base || '');

    if (this.params.base) this.updateHistory();
  }

  (0, _createClass3.default)(Command, [{
    key: 'find',
    value: function find(command) {
      var parts = command.split(" ");
      var c = parts.shift();
      var pars = parts.join(" ");
      if (this.hash[c]) return [this.hash[c], pars];
      return undefined;
    }
  }, {
    key: 'use',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(command) {
        var op = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var res, _res, _res2, com, pars, parse;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                res = this.find(command);

                if (!res) {
                  _context.next = 21;
                  break;
                }

                _res = res, _res2 = (0, _slicedToArray3.default)(_res, 2), com = _res2[0], pars = _res2[1];

                if (!(com.params.op && !op)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', 'You do not have permission to use this command');

              case 5:
                parse = com.params.parse;

                if (!parse) {
                  _context.next = 14;
                  break;
                }

                if (!(typeof parse == 'function')) {
                  _context.next = 13;
                  break;
                }

                pars = parse(pars);

                if (!(pars === false)) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt('return', com.params.usage ? 'Usage: ' + com.params.usage : 'Bad syntax');

              case 11:
                _context.next = 14;
                break;

              case 13:
                pars = pars.match(parse);

              case 14:
                _context.next = 16;
                return com.params.action(pars);

              case 16:
                res = _context.sent;

                if (!res) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt('return', '' + res);

              case 19:
                _context.next = 22;
                break;

              case 21:
                return _context.abrupt('return', 'Command not found');

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function use(_x2) {
        return _ref.apply(this, arguments);
      }

      return use;
    }()
  }, {
    key: 'updateHistory',
    value: function updateHistory() {
      var _this = this;

      var all = '(.+?)';

      var list = [this.base];
      if (this.params.aliases && this.params.aliases.length) {
        this.params.aliases.forEach(function (al) {
          return list.unshift(_this.parentBase + al);
        });
      }

      list.forEach(function (command) {
        var parentBase = _this.parent ? _this.parent.path || '' : '';
        _this.path = parentBase + _this.space() + (command || all);
        if (_this.path == all && !_this.parent) _this.path = '';

        if (_this.path) _this.hash[_this.path] = _this;
      });
      this.uniqueHash[this.base] = this;
    }
  }, {
    key: 'add',
    value: function add(params) {
      return new Command(params, this);
    }
  }, {
    key: 'space',
    value: function space(end) {
      var first = !(this.parent && this.parent.parent);
      return this.params.merged || !end && first ? '' : ' ';
    }
  }, {
    key: 'setOp',
    value: function setOp(op) {
      this.params.op = op;
    }
  }]);
  return Command;
}();

module.exports = Command;
//# sourceMappingURL=../maps/lib/command.js.map
