'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vec3 = require('vec3').Vec3;

module.exports.server = function (serv) {
  serv.playSound = function (sound, world, position) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        whitelist = _ref.whitelist,
        _ref$blacklist = _ref.blacklist,
        blacklist = _ref$blacklist === undefined ? [] : _ref$blacklist,
        _ref$radius = _ref.radius,
        radius = _ref$radius === undefined ? 32 * 32 : _ref$radius,
        _ref$volume = _ref.volume,
        volume = _ref$volume === undefined ? 1.0 : _ref$volume,
        _ref$pitch = _ref.pitch,
        pitch = _ref$pitch === undefined ? 1.0 : _ref$pitch;

    var players = typeof whitelist != 'undefined' ? (typeof whitelist === 'undefined' ? 'undefined' : (0, _typeof3.default)(whitelist)) instanceof Array ? whitelist : [whitelist] : serv.getNearby({
      world: world,
      position: position.scaled(32).floored(),
      radius: radius // 32 blocks, fixed position
    });
    players.filter(function (player) {
      return blacklist.indexOf(player) == -1;
    }).forEach(function (player) {
      var pos = (position || player.position.scaled(1 / 32)).scaled(8).floored();
      player._client.write('named_sound_effect', {
        soundName: sound,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        volume: volume,
        pitch: Math.round(pitch * 63)
      });
    });
  };

  serv.playNoteBlock = function (pitch, world, position) {
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$instrument = _ref2.instrument,
        instrument = _ref2$instrument === undefined ? 'harp' : _ref2$instrument,
        _ref2$particle = _ref2.particle,
        particle = _ref2$particle === undefined ? true : _ref2$particle;

    if (particle) {
      serv.emitParticle(23, world, position.clone().add(new Vec3(0.5, 1.5, 0.5)), {
        count: 1,
        size: new Vec3(0, 0, 0)
      });
    }
    serv.playSound('note.' + instrument, world, position, { pitch: serv.getNote(pitch) });
  };

  serv.getNote = function (note) {
    return 0.5 * Math.pow(Math.pow(2, 1 / 12), note);
  };
};

module.exports.player = function (player, serv) {
  var _this = this;

  player.playSound = function (sound) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    opt.whitelist = player;
    serv.playSound(sound, player.world, null, opt);
  };

  player.on('placeBlock_cancel', function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3, cancel) {
      var reference = _ref3.reference;
      var id, data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!player.crouching) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return');

            case 2:
              _context.next = 4;
              return player.world.getBlockType(reference);

            case 4:
              id = _context.sent;

              if (!(id != 25)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return');

            case 7:
              cancel(false);
              if (!player.world.blockEntityData[reference.toString()]) player.world.blockEntityData[reference.toString()] = {};
              data = player.world.blockEntityData[reference.toString()];

              if (typeof data.note == 'undefined') data.note = -1;
              data.note++;
              data.note %= 25;
              serv.playNoteBlock(data.note, player.world, reference);

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x4, _x5) {
      return _ref4.apply(this, arguments);
    };
  }());

  player.on('dig_cancel', function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref5, cancel) {
      var position = _ref5.position;
      var id, data;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return player.world.getBlockType(position);

            case 2:
              id = _context2.sent;

              if (!(id != 25)) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return');

            case 5:
              cancel(false);
              if (!player.world.blockEntityData[position.toString()]) player.world.blockEntityData[position.toString()] = {};
              data = player.world.blockEntityData[position.toString()];

              if (typeof data.note == 'undefined') data.note = 0;
              serv.playNoteBlock(data.note, player.world, position);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x6, _x7) {
      return _ref6.apply(this, arguments);
    };
  }());

  player.commands.add({
    base: 'playsound',
    info: 'to play sound for yourself',
    usage: '/playsound <sound_name> [volume] [pitch]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/([^ ]+)(?: ([^ ]+))?(?: ([^ ]+))?/);
      if (!results) return false;
      return {
        sound_name: results[1],
        volume: results[2] ? parseFloat(results[2]) : 1.0,
        pitch: results[3] ? parseFloat(results[3]) : 1.0
      };
    },
    action: function action(_ref7) {
      var sound_name = _ref7.sound_name,
          volume = _ref7.volume,
          pitch = _ref7.pitch;

      player.chat('Playing "' + sound_name + '" (volume: ' + volume + ', pitch: ' + pitch + ')');
      player.playSound(sound_name, { volume: volume, pitch: pitch });
    }
  });

  player.commands.add({
    base: 'playsoundforall',
    info: 'to play sound for everyone',
    usage: '/playsoundforall <sound_name> [volume] [pitch]',
    op: true,
    parse: function parse(str) {
      var results = str.match(/([^ ]+)(?: ([^ ]+))?(?: ([^ ]+))?/);
      if (!results) return false;
      return {
        sound_name: results[1],
        volume: results[2] ? parseFloat(results[2]) : 1.0,
        pitch: results[3] ? parseFloat(results[3]) : 1.0
      };
    },
    action: function action(_ref8) {
      var sound_name = _ref8.sound_name,
          volume = _ref8.volume,
          pitch = _ref8.pitch;

      player.chat('Playing "' + sound_name + '" (volume: ' + volume + ', pitch: ' + pitch + ')');
      serv.playSound(sound_name, player.world, player.position.scaled(1 / 32), { volume: volume, pitch: pitch });
    }
  });
};

module.exports.entity = function (entity, serv) {
  entity.playSoundAtSelf = function (sound) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    serv.playSound(sound, entity.world, entity.position.scaled(1 / 32), opt);
  };
};
//# sourceMappingURL=../../maps/lib/plugins/sound.js.map
