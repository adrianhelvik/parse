'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parseSequence = require('./parseSequence');

var _parseSequence2 = _interopRequireDefault(_parseSequence);

var _parseEither = require('./parseEither');

var _parseEither2 = _interopRequireDefault(_parseEither);

var _parseLex = require('./parseLex');

var _parseLex2 = _interopRequireDefault(_parseLex);

var _parseOne = require('./parseOne');

var _parseOne2 = _interopRequireDefault(_parseOne);

var _circularJson = require('circular-json');

var _circularJson2 = _interopRequireDefault(_circularJson);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseMany(_ref) {
  var shouldThrow = _ref.shouldThrow,
      _ref$index = _ref.index,
      index = _ref$index === undefined ? 0 : _ref$index,
      source = _ref.source,
      tokens = _ref.tokens,
      rule = _ref.rule,
      delimiter = _ref.delimiter;

  var nodes = [];
  var incrementIndex = 0;

  switch (rule.ruleType) {
    case 'lex':
      {
        var match = void 0;
        while (match = (0, _parseLex2.default)({
          shouldThrow: false,
          index: index + incrementIndex,
          source: source,
          rule: rule,
          tokens: tokens,
          type: rule.type
        })) {
          nodes.push(match.node);
          incrementIndex += match.incrementIndex;
          if (delimiter) {
            var delimiterResult = (0, _parseOne2.default)({
              index: index + incrementIndex,
              source: source,
              tokens: tokens,
              rule: delimiter
            });
            if (!delimiterResult) break;else {
              incrementIndex += delimiterResult.incrementIndex;
              nodes.push(delimiterResult.node);
            }
          }
        }
      }
      break;
    case 'sequence':
      {
        var _match = void 0;
        while (_match = (0, _parseSequence2.default)({
          shouldThrow: false,
          index: index + incrementIndex,
          source: source,
          rule: rule.subRule,
          tokens: tokens,
          type: rule.type
        })) {
          nodes.push({
            type: rule.type,
            nodes: _match.nodes
          });
          incrementIndex += _match.incrementIndex;
          if (delimiter) {
            var _delimiterResult = (0, _parseOne2.default)({
              index: index + incrementIndex,
              source: source,
              tokens: tokens,
              rule: delimiter
            });
            if (!_delimiterResult) break;else {
              incrementIndex += _delimiterResult.incrementIndex;
              nodes.push(_delimiterResult.node);
            }
          }
        }
      }
      break;
    case 'either':
      {
        var _match2 = void 0;
        while (_match2 = (0, _parseEither2.default)({
          shouldThrow: false,
          index: index + incrementIndex,
          source: source,
          rule: rule.subRule,
          tokens: tokens,
          type: rule.type
        })) {
          if (Array.isArray(_match2.nodes)) {
            nodes.push({
              type: rule.type,
              nodes: _match2.nodes
            });
          } else {
            nodes.push({
              type: rule.type,
              node: _match2.node
            });
          }

          if (typeof _match2.incrementIndex !== 'number') throw Error('Got non-numeric incrementIndex');
          if (isNaN(_match2.incrementIndex)) throw Error('Got NaN incrementIndex');

          incrementIndex += _match2.incrementIndex;
          if (delimiter) {
            var _delimiterResult2 = (0, _parseOne2.default)({
              index: index + incrementIndex,
              source: source,
              tokens: tokens,
              rule: delimiter
            });
            if (!_delimiterResult2) break;else {
              incrementIndex += _delimiterResult2.incrementIndex;
              nodes.push(_delimiterResult2.node);
            }
          }
        }
      }
      break;
    default:
      throw Error('Invalid rule type: ' + rule.ruleType);
  }

  return {
    incrementIndex: incrementIndex,
    nodes: nodes
  };
}

exports.default = parseMany;