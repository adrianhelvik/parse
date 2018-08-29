'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _InfiniteRecursionError = require('./InfiniteRecursionError');

var _InfiniteRecursionError2 = _interopRequireDefault(_InfiniteRecursionError);

var _parseOptional = require('./parseOptional');

var _parseOptional2 = _interopRequireDefault(_parseOptional);

var _parseZeroPlus = require('./parseZeroPlus');

var _parseZeroPlus2 = _interopRequireDefault(_parseZeroPlus);

var _parseSequence = require('./parseSequence');

var _parseSequence2 = _interopRequireDefault(_parseSequence);

var _parseOnePlus = require('./parseOnePlus');

var _parseOnePlus2 = _interopRequireDefault(_parseOnePlus);

var _parseEither = require('./parseEither');

var _parseEither2 = _interopRequireDefault(_parseEither);

var _parseOne = require('./parseOne');

var _parseOne2 = _interopRequireDefault(_parseOne);

var _parseLex = require('./parseLex');

var _parseLex2 = _interopRequireDefault(_parseLex);

var _parseAll = require('./parseAll');

var _parseAll2 = _interopRequireDefault(_parseAll);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseRule(ctx) {
  _assert2.default.equal(_typeof(ctx.optional), 'number');
  (0, _assert2.default)(!isNaN(ctx.optional));

  ctx.recursionDepth = ctx.recursionDepth + 1 || 1;

  if (ctx.recursionDepth > 1000) throw (0, _InfiniteRecursionError2.default)(ctx);

  switch (ctx.rule.ruleType) {
    case 'one':
      return (0, _parseOne2.default)(ctx);
    case 'lex':
      return (0, _parseLex2.default)(ctx);
    case 'either':
      return (0, _parseEither2.default)(ctx);
    case 'sequence':
      return (0, _parseSequence2.default)(ctx);
    case 'optional':
      return (0, _parseOptional2.default)(ctx);
    case 'one_plus':
      return (0, _parseOnePlus2.default)(ctx);
    case 'zero_plus':
      return (0, _parseZeroPlus2.default)(ctx);
    case 'all':
      return (0, _parseAll2.default)(ctx);
    default:
      break;
  }

  throw Error('Unknown rule type: ' + ctx.rule.ruleType);
}

exports.default = parseRule;