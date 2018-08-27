'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ExpectedRuleError = require('./ExpectedRuleError');

var _ExpectedRuleError2 = _interopRequireDefault(_ExpectedRuleError);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseOne(ctx) {
  var subRule = ctx.rule.subRule;


  var nextCtx = Object.create(ctx);
  nextCtx.rule = subRule;

  var match = (0, _parseRule2.default)(nextCtx);

  if (!match) {
    if (ctx.optional > 0) return null;
    throw (0, _ExpectedRuleError2.default)(ctx);
  }

  _assert2.default.equal(_typeof(match.inc), 'number');

  return {
    value: {
      node: match.value,
      type: ctx.rule.type
    },
    inc: match.inc
  };
}

exports.default = parseOne;