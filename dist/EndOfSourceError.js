'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _whileEvaluating = require('./whileEvaluating');

var _whileEvaluating2 = _interopRequireDefault(_whileEvaluating);

var _nodeToString = require('./nodeToString');

var _nodeToString2 = _interopRequireDefault(_nodeToString);

var _ruleToString = require('./ruleToString');

var _ruleToString2 = _interopRequireDefault(_ruleToString);

var _trace = require('@adrianhelvik/trace');

var _trace2 = _interopRequireDefault(_trace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UnexpectedToken(ctx) {
  var token = ctx.tokens[ctx.index];

  var message = (0, _trace2.default)(ctx.source, ctx.tokens[ctx.index].index, 'Expected end of source. Got ' + token.type + ' "' + token.value + '"' + (0, _whileEvaluating2.default)(ctx) + '.');

  throw Error(message);
}

exports.default = UnexpectedToken;