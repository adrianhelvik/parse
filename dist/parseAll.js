'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ExpectedRuleError = require('./ExpectedRuleError');

var _ExpectedRuleError2 = _interopRequireDefault(_ExpectedRuleError);

var _EndOfSourceError = require('./EndOfSourceError');

var _EndOfSourceError2 = _interopRequireDefault(_EndOfSourceError);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseAll(ctx) {
  var subRule = ctx.rule.subRule;


  var nextCtx = Object.create(ctx);
  nextCtx.rule = subRule;

  var match = (0, _parseRule2.default)(nextCtx);

  if (!match) throw (0, _ExpectedRuleError2.default)(ctx);

  _assert2.default.equal(_typeof(match.inc), 'number');

  if (ctx.index + match.inc < ctx.tokens.length) {
    nextCtx.index += match.inc;
    throw (0, _EndOfSourceError2.default)(nextCtx);
  }

  return {
    value: {
      node: match.value,
      type: ctx.rule.type
    },
    inc: match.inc
  };
}

exports.default = parseAll;