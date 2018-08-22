import whileEvaluating from './whileEvaluating'
import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function SequenceTerminatedError(subCtx) {
  const ctx = subCtx.__proto__
  const message = `${ruleToString(ctx.rule)} not completed. Expected ${ruleToString(subCtx.rule)}${whileEvaluating(ctx)}.`
  return Error(trace(subCtx.source, subCtx.tokens[subCtx.index].index, message))
}

export default SequenceTerminatedError
