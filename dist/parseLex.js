'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UnexpectedToken = require('./UnexpectedToken');

var _UnexpectedToken2 = _interopRequireDefault(_UnexpectedToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseLex(ctx) {
  if (ctx.index >= ctx.tokens.length) {
    if (ctx.optional > 0) return null;
    throw (0, _UnexpectedToken2.default)(ctx);
  }
  if (ctx.rule.type !== ctx.tokens[ctx.index].type) {
    if (ctx.optional > 0) return null;
    throw (0, _UnexpectedToken2.default)(ctx);
  }
  if (ctx.rule.value && ctx.tokens[ctx.index].value !== ctx.rule.value) {
    if (ctx.optional > 0) return null;
    throw (0, _UnexpectedToken2.default)(ctx);
  }
  return {
    value: ctx.tokens[ctx.index],
    inc: 1
  };
}

exports.default = parseLex;