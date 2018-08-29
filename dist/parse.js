'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _convertSyntax = require('./convertSyntax');

var _convertSyntax2 = _interopRequireDefault(_convertSyntax);

var _trace = require('@adrianhelvik/trace');

var _trace2 = _interopRequireDefault(_trace);

var _parseOne2 = require('./parseOne');

var _parseOne3 = _interopRequireDefault(_parseOne2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(_ref) {
  var _ref$index = _ref.index,
      index = _ref$index === undefined ? 0 : _ref$index,
      source = _ref.source,
      tokens = _ref.tokens,
      syntax = _ref.syntax;

  var rule = (0, _convertSyntax2.default)(syntax);

  var _parseOne = (0, _parseOne3.default)({
    index: index,
    source: source,
    tokens: tokens,
    rule: rule,
    shouldThrow: true
  }),
      incrementIndex = _parseOne.incrementIndex,
      nodes = _parseOne.nodes,
      node = _parseOne.node;

  if (index + incrementIndex < tokens.length) {
    console.log(JSON.stringify(nodes || node, null, 2));
    throw Error((0, _trace2.default)(source, tokens[index + incrementIndex].index, 'Parsing did not complete'));
  }

  if (nodes) {
    return {
      type: rule.type,
      nodes: nodes
    };
  }

  return {
    type: rule.type,
    node: node
  };
}

exports.default = parse;