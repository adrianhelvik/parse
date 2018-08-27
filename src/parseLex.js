import UnexpectedToken from './UnexpectedToken'

function parseLex(ctx) {
  if (ctx.rule.type !== ctx.tokens[ctx.index].type) {
    return null
  }
  if (ctx.rule.value && ctx.tokens[ctx.index].value !== ctx.rule.value) {
    return null
  }
  return {
    value: ctx.tokens[ctx.index],
    inc: 1,
  }
}

export default parseLex
