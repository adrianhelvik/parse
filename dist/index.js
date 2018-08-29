'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _convertSyntax = require('@adrianhelvik/convert-syntax');

var _convertSyntax2 = _interopRequireDefault(_convertSyntax);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      syntax = _ref.syntax,
      tokens = _ref.tokens,
      source = _ref.source,
      _ref$rule = _ref.rule,
      rule = _ref$rule === undefined ? 'main' : _ref$rule;

  var rules = (0, _convertSyntax2.default)(syntax);
  var _rule = rules.get(rule);

  var ctx = {
    optional: 0,
    index: 0,
    tokens: tokens,
    source: source,
    rule: _rule
  };

  var match = (0, _parseRule2.default)(ctx);

  return match.value;
}

exports.default = parse;