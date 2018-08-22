import parseRule from './parseRule'

function parseSequence(ctx) {
  const nodes = []
  let inc = 0

  for (let subRule of ctx.rule.subRule) {
    const subCtx = Object.create(ctx)
    subCtx.rule = subRule
    subCtx.index = ctx.index + inc
    const match = parseRule(subCtx)
    if (! match) {
      if (ctx.optional)
        return null
      throw Error('TODO')
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
