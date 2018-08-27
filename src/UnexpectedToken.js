import whileEvaluating from './whileEvaluating'
import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function UnexpectedToken(ctx) {
  const token = ctx.tokens[ctx.index]

  const message = trace(
    ctx.source,
    ctx.tokens[ctx.index].index,
    `Unexpected \`${token.type}\` "${token.value}". Expected ${ruleToString(ctx.rule)}${whileEvaluating(ctx.__proto__)}.`
  )

  return Error(message)
}

export default UnexpectedToken
