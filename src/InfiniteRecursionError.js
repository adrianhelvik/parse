import whileEvaluating from './whileEvaluating'
import nodeToString from './nodeToString'
import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function InfiniteRecursionError(ctx) {
  const token = ctx.tokens[ctx.index]

  const message = trace(
    ctx.source,
    ctx.tokens[ctx.index].index,
    `Infinite recursion at ${token.type} "${token.value}". Expected ${ruleToString(ctx.rule)}${whileEvaluating(ctx)}.${partialMatchToString(ctx.partialMatch)}`
  )

  throw Error(message)
}

export default InfiniteRecursionError

function partialMatchToString(partialMatch) {
  if (! partialMatch)
    return ''
  return `\n\nPartial match of ${partialMatch.ctx.rule.type}: ${nodeToString(partialMatch.nodes)}`
}
