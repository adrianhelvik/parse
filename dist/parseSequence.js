'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SequenceTerminatedError = require('./SequenceTerminatedError');

var _SequenceTerminatedError2 = _interopRequireDefault(_SequenceTerminatedError);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseSequence(ctx) {
  var nodes = [];
  var inc = 0;
  var verified = false;

  ctx.partialMatch = { nodes: nodes, ctx: ctx };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ctx.rule.subRule[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var subRule = _step.value;

      var subCtx = Object.create(ctx);
      if (subRule.ruleType === 'verified') {
        verified = true;
        continue;
      }
      subCtx.rule = subRule;
      subCtx.index = ctx.index + inc;
      var match = (0, _parseRule2.default)(subCtx);
      if (!match) {
        if (subCtx.optional && !verified) {
          return null;
        }
        throw (0, _SequenceTerminatedError2.default)(subCtx, nodes);
      }
      inc += match.inc;
      nodes.push(match.value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
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

exports.default = parseSequence;