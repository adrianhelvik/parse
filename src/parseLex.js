import UnexpectedToken from './UnexpectedToken'
import assert from 'assert'

function parseLex(ctx) {
  if (ctx.rule.type !== ctx.tokens[ctx.index].type)
    throw UnexpectedToken(ctx)
  if (ctx.rule.value && ctx.tokens[ctx.index].value !== ctx.rule.value)
    throw UnexpectedToken(ctx)
  return {
    value: ctx.tokens[ctx.index],
    inc: 1,
  }
}

export default parseLex
