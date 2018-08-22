import trace from '@adrianhelvik/trace'

function UnexpectedToken(ctx) {
  const token = ctx.tokens[ctx.index]
  const type = ctx.rule.value
    ? `${ctx.rule.type} "${ctx.rule.value}"`
    : ctx.rule.type
  const message = trace(
    ctx.source,
    ctx.index,
    `Unexpected token ${token.type} "${token.value}". Expected ${type}.`
  )
  throw Error(message)
}

export default UnexpectedToken
