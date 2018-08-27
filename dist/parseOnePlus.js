'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExpectedRuleError = require('./ExpectedRuleError');

var _ExpectedRuleError2 = _interopRequireDefault(_ExpectedRuleError);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseOnePlus(ctx) {
  var nodes = [];
  var inc = 0;

  var delimiter = ctx.rule.delimiter;

  while (true) {
    var subCtx = Object.create(ctx);
    subCtx.rule = ctx.rule.subRule;
    subCtx.index = ctx.index + inc;
    if (nodes.length >= 1) subCtx.optional += 1;

    var match = (0, _parseRule2.default)(subCtx);

    if (!match) {
      if (!nodes.length) {
        if (ctx.optional > 0) return null;
        throw (0, _ExpectedRuleError2.default)(ctx);
      }
      break;
    }

    inc += match.inc;
    nodes.push(match.value);

    if (ctx.rule.delimiter) {
      var delimCtx = Object.create(ctx);
      delimCtx.rule = ctx.rule.delimiter;
      delimCtx.index = ctx.index + inc;
      delimCtx.optional = ctx.optional + 1;
      var delimiterMatch = (0, _parseRule2.default)(delimCtx);

      if (!delimiterMatch) break;

      inc += delimiterMatch.inc;
      nodes.push(delimiterMatch.value);
    }
  }

  return {
    value: {
      type: ctx.rule.type,
      nodes: nodes
    },
    inc: inc
  };
}

exports.default = parseOnePlus;