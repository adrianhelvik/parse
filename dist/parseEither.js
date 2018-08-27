'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExpectedRuleError = require('./ExpectedRuleError');

var _ExpectedRuleError2 = _interopRequireDefault(_ExpectedRuleError);

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseEither(ctx) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ctx.rule.subRule[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var subRule = _step.value;

      var nextCtx = Object.create(ctx);
      nextCtx.optional += 1;
      nextCtx.rule = subRule;
      var match = (0, _parseRule2.default)(nextCtx);
      if (match) {
        return {
          inc: match.inc,
          value: {
            type: ctx.rule.type,
            node: match.value
          }
        };
      }
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

  if (ctx.optional > 0) return null;

  throw (0, _ExpectedRuleError2.default)(ctx);
}

exports.default = parseEither;