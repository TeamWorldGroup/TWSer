'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.server = function (serv) {
  var ticking = false;
  serv.on('tick', function (delta) {
    var _this = this;

    if (ticking || delta > 1) return;
    ticking = true;
    _promise2.default.all((0, _keys2.default)(serv.entities).map(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id) {
        var entity, players, posAndOnGround;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                entity = serv.entities[id];

                if (!(entity.deathTime && Date.now() - entity.bornTime >= entity.deathTime)) {
                  _context.next = 6;
                  break;
                }

                entity.destroy();
                return _context.abrupt('return');

              case 6:
                if (entity.pickupTime && Date.now() - entity.bornTime >= entity.pickupTime) {
                  players = serv.getNearby({
                    world: entity.world,
                    position: entity.position,
                    radius: 1.5 * 32 // Seems good for now
                  });

                  if (players.length) {
                    players[0].collect(entity);
                  }
                }

              case 7:
                if (!(!entity.velocity || !entity.size)) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return');

              case 9:
                _context.next = 11;
                return entity.calculatePhysics(delta);

              case 11:
                posAndOnGround = _context.sent;

                if (entity.type == 'mob') entity.sendPosition(posAndOnGround.position, posAndOnGround.onGround);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())).then(function () {
      return ticking = false;
    }).catch(function (err) {
      return setTimeout(function () {
        throw err;
      }, 0);
    });
  });
};

module.exports.entity = function (entity) {
  entity.sendMetadata = function (data) {
    entity._writeOthersNearby('entity_metadata', {
      entityId: entity.id,
      metadata: data
    });
  };

  entity.setAndUpdateMetadata = function (data) {
    entity.metadata = data;
    entity.sendMetadata(data);
  };
};
//# sourceMappingURL=../../maps/lib/plugins/entities.js.map
