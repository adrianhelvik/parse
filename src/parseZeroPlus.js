import parseRule from './parseRule'

function parseZeroPlus(ctx) {
  const nodes = []
  let inc = 0
  
  while (true) {
    const subCtx = Object.create(ctx)
    subCtx.rule = ctx.rule.subRule
    subCtx.index = ctx.index + inc
    subCtx.optional = true

    const match = parseRule(subCtx)

    if (! match)
      break

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

export default parseZeroPlus
