'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parseRule = require('./parseRule');

var _parseRule2 = _interopRequireDefault(_parseRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseOptional(ctx) {
  var subCtx = Object.create(ctx);
  subCtx.rule = ctx.rule.subRule;
  subCtx.optional = ctx.optional + 1;

  var match = (0, _parseRule2.default)(subCtx);

  if (!match) {
    return {
      inc: 0,
      value: {
        type: ctx.rule.type,
        node: null
      }
    };
  }

  return {
    inc: match.inc,
    value: {
      type: ctx.rule.type,
      node: match.value
    }
  };
}

exports.default = parseOptional;