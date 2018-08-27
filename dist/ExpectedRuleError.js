'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ruleToString = require('./ruleToString');

var _ruleToString2 = _interopRequireDefault(_ruleToString);

var _trace = require('@adrianhelvik/trace');

var _trace2 = _interopRequireDefault(_trace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ExpectedRuleError(ctx) {
  var message = 'Expected ' + (0, _ruleToString2.default)(ctx.rule);
  return Error((0, _trace2.default)(ctx.source, ctx.tokens[ctx.index].index, message));
}

exports.default = ExpectedRuleError;