import parseRule from './parseRule'

function parseZeroPlus(ctx) {
  const nodes = []
  let inc = 0

  while (true) {
    const subCtx = Object.create(ctx)
    subCtx.rule = ctx.rule.subRule
    subCtx.index = ctx.index + inc
    subCtx.optional = ctx.optional + 1

    const match = parseRule(subCtx)

    if (! match)
      break

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

export default parseZeroPlus
