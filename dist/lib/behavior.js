'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (obj) {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(eventName, data, func, cancelFunc) {
      var hiddenCancelled, cancelled, cancelCount, defaultCancel, cancel, resp;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              hiddenCancelled = false;
              cancelled = false;
              cancelCount = 0;
              defaultCancel = true;

              cancel = function cancel() {
                var dC = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                // Hidden shouldn't be used often but it's not hard to implement so meh
                if (hidden) hiddenCancelled = true;else {
                  cancelled = true;
                  cancelCount++;
                }
                defaultCancel = dC;
              };

              resp = void 0;
              _context.next = 8;
              return obj.emitThen(eventName + '_cancel', data, cancel).catch(function (err) {
                return setTimeout(function () {
                  throw err;
                }, 0);
              });

            case 8:
              _context.next = 10;
              return obj.emitThen(eventName, data, cancelled, cancelCount).catch(function (err) {
                return setTimeout(function () {
                  throw err;
                }, 0);
              });

            case 10:
              if (!(!hiddenCancelled && !cancelled)) {
                _context.next = 19;
                break;
              }

              resp = func(data);

              if (!(resp instanceof _promise2.default)) {
                _context.next = 16;
                break;
              }

              _context.next = 15;
              return resp.catch(function (err) {
                return setTimeout(function () {
                  throw err;
                }, 0);
              });

            case 15:
              resp = _context.sent;

            case 16:
              if (typeof resp == 'undefined') resp = true;
              _context.next = 26;
              break;

            case 19:
              if (!(cancelFunc && defaultCancel)) {
                _context.next = 26;
                break;
              }

              resp = cancelFunc(data);

              if (!(resp instanceof _promise2.default)) {
                _context.next = 25;
                break;
              }

              _context.next = 24;
              return resp.catch(function (err) {
                return setTimeout(function () {
                  throw err;
                }, 0);
              });

            case 24:
              resp = _context.sent;

            case 25:
              if (typeof resp == 'undefined') resp = false;

            case 26:
              _context.next = 28;
              return obj.emitThen(eventName + '_done', data, cancelled).catch(function (err) {
                return setTimeout(function () {
                  throw err;
                }, 0);
              });

            case 28:
              return _context.abrupt('return', resp);

            case 29:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();
};
//# sourceMappingURL=../maps/lib/behavior.js.map
