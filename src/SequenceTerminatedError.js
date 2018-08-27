import whileEvaluating from './whileEvaluating'
import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function SequenceTerminatedError(subCtx, nodes) {
  const ctx = subCtx.__proto__
  const message = `${ruleToString(ctx.rule)} not completed. Got ${ruleToString(subCtx.rule)}. Expected ${ruleToString(subCtx.rule)}${whileEvaluating(ctx)}.\n\nGot ${nodesToString(nodes)}`
  return Error(trace(subCtx.source, subCtx.tokens[subCtx.index].index, message))
}

export default SequenceTerminatedError

function nodesToString(nodes) {
  const result = []
  for (let n of nodes) {
    while (n && n.node)
      n = n.node
    if (n.nodes)
      result.push(nodesToString(n.nodes))
    else 
      result.push(`\`${n.type}\` "${n.value}"`)
  }
  return result.join('\n')
}
