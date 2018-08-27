import ExpectedRuleError from './ExpectedRuleError'
import parseRule from './parseRule'
import assert from 'assert'

function parseOne(ctx) {
  const { subRule } = ctx.rule

  const nextCtx = Object.create(ctx)
  nextCtx.rule = subRule

  const match = parseRule(nextCtx)

  if (! match) {
    if (ctx.optional)
      return null
    throw ExpectedRuleError(ctx)
  }

  assert.equal(typeof match.inc, 'number')

  return {
    value: {
      node: match.value,
      type: ctx.rule.type,
    },
    inc: match.inc,
  }
}

export default parseOne
