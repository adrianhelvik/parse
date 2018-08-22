import parseRule from './parseRule'

function parseOptional(ctx) {
  const subCtx = Object.create(ctx)
  subCtx.optional = true
  subCtx.rule = ctx.rule.subRule

  const match = parseRule(subCtx)

  if (! match) {
    return {
      inc: 0,
      value: {
        type: ctx.rule.type,
        node: null,
      }
    }
  }

  return {
    inc: match.inc,
    value: {
      type: ctx.rule.type,
      node: match.value,
    }
  }
}

export default parseOptional
