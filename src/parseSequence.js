import SequenceTerminatedError from './SequenceTerminatedError'
import ruleToString from './ruleToString'
import parseRule from './parseRule'

function parseSequence(ctx) {
  const nodes = []
  let inc = 0
  let verified = false

  for (let subRule of ctx.rule.subRule) {
    const subCtx = Object.create(ctx)
    if (subRule.ruleType === 'verified') {
      verified = true
      continue
    }
    subCtx.rule = subRule
    subCtx.index = ctx.index + inc
    if (verified) {
      subCtx.optional = 0
    }
    const match = parseRule(subCtx)
    if (! match) {
      if (subCtx.optional > 0)
        return null
      throw SequenceTerminatedError(subCtx, nodes)
    }
    inc += match.inc
    nodes.push(match.value)
  }

  return {
    value: {
      type: ctx.rule.type,
      nodes,
    },
    inc,
  }
}

export default parseSequence
