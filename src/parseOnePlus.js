import ExpectedRuleError from './ExpectedRuleError'
import parseRule from './parseRule'

function parseOnePlus(ctx) {
  const nodes = []
  let inc = 0
  
  while (true) {
    const subCtx = Object.create(ctx)
    subCtx.rule = ctx.rule.subRule
    subCtx.index = ctx.index + inc
    if (nodes.length >= 1)
      subCtx.optional += 1

    const match = parseRule(subCtx)

    if (! match) {
      if (! nodes.length)
        throw ExpectedRuleError(ctx)
      break
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

export default parseOnePlus
