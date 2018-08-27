'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ruleToString = require('./ruleToString');

var _ruleToString2 = _interopRequireDefault(_ruleToString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function whileEvaluating(ctx) {
  if (!ctx.__proto__ || !ctx.__proto__.rule) return '';
  return ' while evaluating ' + (0, _ruleToString2.default)(ctx.__proto__.rule) + within(ctx.__proto__);
}

function within(ctx) {
  if (!ctx.__proto__ || !ctx.__proto__.rule) return '';
  return ' within ' + (0, _ruleToString2.default)(ctx.__proto__.rule) + within(ctx.__proto__);
}

exports.default = whileEvaluating;