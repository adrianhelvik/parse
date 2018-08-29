import whileEvaluating from './whileEvaluating'
import nodeToString from './nodeToString'
import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function UnexpectedToken(ctx) {
  const token = ctx.tokens[ctx.index]

  const message = trace(
    ctx.source,
    ctx.tokens[ctx.index].index,
    `Expected end of source. Got ${token.type} "${token.value}"${whileEvaluating(ctx)}.`
  )

  throw Error(message)
}

export default UnexpectedToken
