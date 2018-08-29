'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = expectationError;

var _trace = require('@adrianhelvik/trace');

var _trace2 = _interopRequireDefault(_trace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function expectationError(_ref) {
  var token = _ref.token,
      source = _ref.source,
      message = _ref.message,
      rule = _ref.rule;

  var val = rule.value ? ' "' + rule.value + '"' : '';
  throw Error((0, _trace2.default)(source, token.index, 'Expected ' + rule.type + val + ', but got ' + token.type + ' "' + token.value + '".'));
}