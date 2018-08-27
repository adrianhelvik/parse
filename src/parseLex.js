import UnexpectedToken from './UnexpectedToken'

function parseLex(ctx) {
  if (ctx.index >= ctx.tokens.length) {
    if (ctx.optional > 0)
      return null
    throw UnexpectedToken(ctx)
  }
  if (ctx.rule.type !== ctx.tokens[ctx.index].type) {
    if (ctx.optional > 0)
      return null
    throw UnexpectedToken(ctx)
  }
  if (ctx.rule.value && ctx.tokens[ctx.index].value !== ctx.rule.value) {
    if (ctx.optional > 0)
      return null
    throw UnexpectedToken(ctx)
  }
  return {
    value: ctx.tokens[ctx.index],
    inc: 1,
  }
}

export default parseLex
