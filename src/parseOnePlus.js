import ExpectedRuleError from './ExpectedRuleError'
import parseRule from './parseRule'

function parseOnePlus(ctx) {
  const nodes = []
  let inc = 0

  const delimiter = ctx.rule.delimiter

  while (true) {
    const subCtx = Object.create(ctx)
    subCtx.rule = ctx.rule.subRule
    subCtx.index = ctx.index + inc
    if (nodes.length >= 1)
      subCtx.optional += 1

    const match = parseRule(subCtx)

    if (! match) {
      if (! nodes.length) {
        if (ctx.optional > 0)
          return null
        throw ExpectedRuleError(ctx)
      }
      break
    }

    inc += match.inc
    nodes.push(match.value)

    if (ctx.rule.delimiter) {
      const delimCtx = Object.create(ctx)
      delimCtx.rule = ctx.rule.delimiter
      delimCtx.index = ctx.index + inc
      delimCtx.optional = ctx.optional + 1
      const delimiterMatch = parseRule(delimCtx)

      if (! delimiterMatch)
        break

      inc += delimiterMatch.inc
      nodes.push(delimiterMatch.value)
    }
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
