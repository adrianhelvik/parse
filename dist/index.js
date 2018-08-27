'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _convertSyntax = require('@adrianhelvik/convert-syntax');

var _convertSyntax2 = _interopRequireDefault(_convertSyntax);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(_ref) {
  var syntax = _ref.syntax,
      tokens = _ref.tokens,
      source = _ref.source;

  var rule = (0, _convertSyntax2.default)(syntax);

  var ctx = {
    optional: 0,
    index: 0,
    tokens: tokens,
    source: source,
    rule: rule
  };

  var match = (0, _parseRule2.default)(ctx);

  return match.value;
}

exports.default = parse;