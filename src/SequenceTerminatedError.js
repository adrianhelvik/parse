import nodeToString from './nodeToString'
import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function SequenceTerminatedError(subCtx, nodes) {
  const ctx = subCtx.__proto__

  const message = `Expected ${ruleToString(subCtx.rule)} while parsing ${ruleToString(ctx.rule)}, but got ${tokenToString(subCtx.tokens[subCtx.index])}. Partial match: ${nodeToString(nodes)}.`
  return Error(trace(subCtx.source, subCtx.tokens[subCtx.index].index, message))
}

export default SequenceTerminatedError

function tokenToString(token) {
  return `${token.type} "${token.value}"`
}
