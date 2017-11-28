'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserError = require('flying-squid').UserError;

module.exports.player = function (player, serv) {
  var _this = this;

  player.commands.add({
    base: 'help',
    info: 'to show all commands',
    usage: '/help [command]',
    parse: function parse(str) {
      var params = str.split(' ');
      var page = parseInt(params[params.length - 1]);
      if (page) {
        params.pop();
      }
      var search = params.join(' ');
      return { search: search, page: page && page - 1 || 0 };
    },
    action: function action(_ref) {
      var search = _ref.search,
          page = _ref.page;

      if (page < 0) return 'Page # must be >= 1';
      var hash = player.commands.uniqueHash;

      var PAGE_LENGTH = 7;

      var found = (0, _keys2.default)(hash).filter(function (h) {
        return (h + ' ').indexOf(search && search + ' ' || '') == 0;
      });

      if (found.length == 0) {
        // None found
        return 'Could not find any matches';
      } else if (found.length == 1) {
        // Single command found, giev info on command
        var cmd = hash[found[0]];
        var usage = cmd.params && cmd.params.usage || cmd.base;
        var info = cmd.params && cmd.params.info || 'No info';
        player.chat(usage + ': ' + info);
      } else {
        // Multiple commands found, give list with pages
        var totalPages = Math.ceil((found.length - 1) / PAGE_LENGTH);
        if (page >= totalPages) return 'There are only' + totalPages + ' help pages';
        found = found.sort();
        if (found.indexOf('search') != -1) {
          var baseCmd = hash[search];
          player.chat(baseCmd.base + ' -' + (baseCmd.params && baseCmd.params.info && ' ' + baseCmd.params.info || '=-=-=-=-=-=-=-=-'));
        } else {
          player.chat('Help -=-=-=-=-=-=-=-=-');
        }
        for (var i = PAGE_LENGTH * page; i < Math.min(PAGE_LENGTH * (page + 1), found.length); i++) {
          if (found[i] === search) continue;
          var _cmd = hash[found[i]];
          var _usage = _cmd.params && _cmd.params.usage || _cmd.base;
          var _info = _cmd.params && _cmd.params.info || 'No info';
          player.chat(_usage + ': ' + _info);
        }
        player.chat('--=[Page ' + (page + 1) + ' of ' + totalPages + ']=--');
      }
    }
  });

  player.commands.add({
    base: 'ping',
    info: 'to pong!',
    usage: '/ping [number]',
    action: function action(params) {
      var num = params[0] * 1 + 1;

      var str = 'pong';
      if (!isNaN(num)) str += ' [' + num + ']';

      player.chat(str + '!');
    }
  });

  player.commands.add({
    base: 'modpe',
    info: 'for modpe commands',
    usage: '/modpe <params>',
    parse: function parse(str) {
      return str ? str : false;
    },
    action: function action(str) {
      player.emit("modpe", str);
    }
  });

  player.commands.add({
    base: 'version',
    info: 'to get version of the server',
    usage: '/version',
    action: function action() {
      return 'This server is running flying-squid version ' + require("../../../package").version;
    }
  });

  player.commands.add({
    base: 'bug',
    info: 'to bug report',
    usage: '/bug',
    action: function action() {
      return 'Report bugs / issues here: https://github.com/PrismarineJS/flying-squid/issues';
    }
  });

  player.commands.add({
    base: 'selector',
    info: 'Get array from selector',
    usage: '/selector <selector>',
    op: true,
    parse: function parse(str) {
      return str || false;
    },
    action: function action(sel) {
      var arr = serv.selectorString(sel, player.position.scaled(1 / 32), player.world);
      player.chat((0, _stringify2.default)(arr.map(function (a) {
        return a.id;
      })));
    }
  });

  player.handleCommand = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(str) {
      var res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return player.commands.use(str, player.op);

            case 3:
              res = _context.sent;

              if (res) player.chat(serv.color.red + res);
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              if (_context.t0.userError) player.chat(serv.color.red + 'Error: ' + _context.t0.message);else setTimeout(function () {
                throw _context.t0;
              }, 0);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[0, 7]]);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
};

module.exports.entity = function (entity, serv) {
  entity.selectorString = function (str) {
    return serv.selectorString(str, entity.position.scaled(1 / 32), entity.world);
  };
};

module.exports.server = function (serv) {

  function shuffleArray(array) {
    var currentIndex = array.length,
        temporaryValue = void 0,
        randomIndex = void 0;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  var notudf = function notudf(i) {
    return typeof i != 'undefined';
  };

  serv.selector = function (type, opt) {
    if (['all', 'random', 'near', 'entity'].indexOf(type) == -1) throw new UserError('serv.selector(): type must be either [all, random, near, or entity]');

    var count = typeof opt.count != 'undefined' ? count : type == 'all' || type == 'entity' ? serv.entities.length : 1;
    var pos = opt.pos;
    var sample = void 0;
    if (type == 'all') sample = serv.players;else if (type == 'random' || type == 'near') sample = serv.players.filter(function (p) {
      return p.health != 0;
    });else if (type == 'entity') sample = (0, _keys2.default)(serv.entities).map(function (k) {
      return serv.entities[k];
    });

    var checkOption = function checkOption(val, compare) {
      if (!val) return true;
      var not = val[0] == '!';
      var v = val;
      if (not) v = v.slice(1, v.length);
      if (not && compare == v) return false;
      if (!not && compare != v) return false;
      return true;
    };

    var scores = {
      max: [],
      min: []
    };

    (0, _keys2.default)(opt).forEach(function (o) {
      if (o.indexOf('score_') != 0) return;
      var score = o.replace('score_', '');
      if (score.indexOf('_min') == score.length - 1) {
        scores.min.push({
          score: score.replace('_min', ''),
          val: opt[o]
        });
      } else {
        scores.max.push({
          score: score,
          val: opt[o]
        });
      }
    });

    sample = sample.filter(function (s) {
      if (notudf(opt.radius) && s.position.scaled(1 / 32).distanceTo(pos) > opt.radius || notudf(opt.minRadius) && s.position.scaled(1 / 32).distanceTo(pos) < opt.minRadius || notudf(opt.gameMode) && s.gameMode != opt.gameMode || notudf(opt.level) && s.level > opt.level || notudf(opt.minLevel) && s.level < opt.minLevel || notudf(opt.yaw) && s.yaw > opt.yaw || notudf(opt.minYaw) && s.yaw < opt.minYaw || notudf(opt.pitch) && s.pitch > opt.pitch || notudf(opt.minPitch) && s.pitch < opt.minPitch) return false;

      if (!checkOption(opt.team, s.team)) return false;
      if (!checkOption(opt.name, s.username)) return false;
      if (!checkOption(opt.type, s.name)) return false;

      var fail = false;
      scores.max.forEach(function (m) {
        if (fail) return;
        if (!notudf(s.scores[m.score])) fail = true;else if (s.scores[m] > m.val) fail = true;
      });
      if (fail) return false;
      scores.min.forEach(function (m) {
        if (fail) return;
        if (!notudf(s.scores[m.score])) fail = true;else if (s.scores[m] < m.val) fail = true;
      });
      return !fail;
    });

    if (type == 'near') sample.sort(function (a, b) {
      return a.position.distanceTo(opt.pos) > b.position.distanceTo(opt.pos);
    });else if (type == 'random') sample = shuffleArray(sample);else sample = sample.reverse(); // Front = newest

    if (count > 0) return sample.slice(0, count);else return sample.slice(count); // Negative, returns from end
  };

  serv.selectorString = function (str, pos, world) {
    var allowUser = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    pos = pos.clone();
    var player = serv.getPlayer(str);
    if (!player && str[0] != '@') return [];else if (player) return allowUser ? [player] : [];
    var match = str.match(/^@([arpe])(?:\[([^\]]+)\])?$/);
    if (match == null) throw new UserError('Invalid selector format');
    var typeConversion = {
      a: 'all',
      r: 'random',
      p: 'near',
      e: 'entity'
    };
    var type = typeConversion[match[1]];
    var opt = match[2] ? match[2].split(',') : [];
    var optPair = [];
    var err = void 0;
    opt.forEach(function (o) {
      var match = o.match(/^([^=]+)=([^=]+)$/);
      if (match == null) err = new UserError('Invalid selector option format: "' + o + '"');else optPair.push({ key: match[1], val: match[2] });
    });
    if (err) throw err;

    var optConversion = {
      type: 'type',
      r: 'radius',
      rm: 'minRadius',
      m: 'gameMode',
      c: 'count',
      l: 'level',
      lm: 'minLevel',
      team: 'team',
      name: 'name',
      rx: 'yaw',
      rxm: 'minYaw',
      ry: 'pitch',
      rym: 'minPitch'
    };
    var convertInt = ['r', 'rm', 'm', 'c', 'l', 'lm', 'rx', 'rxm', 'ry', 'rym'];

    var data = {
      pos: pos,
      world: world,
      scores: [],
      minScores: []
    };

    optPair.forEach(function (_ref3) {
      var key = _ref3.key,
          val = _ref3.val;

      if (['x', 'y', 'z'].indexOf(key) != -1) pos[key] = val;else if (!optConversion[key]) {
        data[key] = val;
      } else {
        if (convertInt.indexOf(key) != -1) val = parseInt(val);
        data[optConversion[key]] = val;
      }
    });

    return serv.selector(type, data);
  };

  serv.posFromString = function (str, pos) {
    if (str.indexOf("~") == -1) return parseFloat(str);
    if (str.match(/~-?\d+/)) return parseFloat(str.slice(1)) + pos;else if (str == '~') return pos;else throw new UserError('Invalid position');
  };
};
//# sourceMappingURL=../../maps/lib/plugins/commands.js.map
