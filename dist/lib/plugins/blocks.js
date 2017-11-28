"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require("vec3").Vec3;

module.exports.player = function (player, serv) {
  var _this = this;

  player.changeBlock = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(position, blockType, blockData) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              serv.players.filter(function (p) {
                return p.world == player.world && player != p;
              }).forEach(function (p) {
                return p.sendBlock(position, blockType, blockData);
              });

              _context.next = 3;
              return player.world.setBlockType(position, blockType);

            case 3:
              _context.next = 5;
              return player.world.setBlockData(position, blockData);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  player.sendBlock = function (position, blockType, blockData) {
    return (// Call from player.setBlock unless you want "local" fake blocks
      player.behavior('sendBlock', {
        position: position,
        blockType: blockType,
        blockData: blockData
      }, function (_ref2) {
        var position = _ref2.position,
            blockType = _ref2.blockType,
            blockData = _ref2.blockData;

        player._client.write("block_change", {
          location: position,
          type: blockType << 4 | blockData
        });
      })
    );
  };

  player.setBlock = function (position, blockType, blockData) {
    return serv.setBlock(player.world, position, blockType, blockData);
  };

  player.commands.add({
    base: 'setblock',
    info: 'set a block at a position',
    usage: '/setblock <x> <y> <z> <id> [data]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/^(~|~?-?[0-9]+) (~|~?-?[0-9]+) (~|~?-?[0-9]+) ([0-9]{1,3})(?: ([0-9]{1,3}))?/);
      if (!results) return false;
      return results;
    },
    action: function action(params) {
      var res = params.slice(1, 4);
      res = res.map(function (val, i) {
        return serv.posFromString(val, player.position[['x', 'y', 'z'][i]] / 32);
      });
      player.setBlock(new Vec3(res[0], res[1], res[2]).floored(), params[4], params[5] || 0);
    }
  });
};
//# sourceMappingURL=../../maps/lib/plugins/blocks.js.map
