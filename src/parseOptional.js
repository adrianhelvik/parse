import parseRule from './parseRule'

function parseOptional(ctx) {
  const subCtx = Object.create(ctx)
  subCtx.rule = ctx.rule.subRule
  subCtx.optional = ctx.optional + 1

  var match = parseRule(subCtx)

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
