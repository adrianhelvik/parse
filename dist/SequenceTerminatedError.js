'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeToString = require('./nodeToString');

var _nodeToString2 = _interopRequireDefault(_nodeToString);

var _ruleToString = require('./ruleToString');

var _ruleToString2 = _interopRequireDefault(_ruleToString);

var _trace = require('@adrianhelvik/trace');

var _trace2 = _interopRequireDefault(_trace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SequenceTerminatedError(subCtx, nodes) {
  var ctx = subCtx.__proto__;

  var message = 'Expected ' + (0, _ruleToString2.default)(subCtx.rule) + ' while parsing ' + (0, _ruleToString2.default)(ctx.rule) + ', but got ' + tokenToString(subCtx.tokens[subCtx.index]) + '. Partial match: ' + (0, _nodeToString2.default)(nodes) + '.';
  return Error((0, _trace2.default)(subCtx.source, subCtx.tokens[subCtx.index].index, message));
}

exports.default = SequenceTerminatedError;


function tokenToString(token) {
  return token.type + ' "' + token.value + '"';
}