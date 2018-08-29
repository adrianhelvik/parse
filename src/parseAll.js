import ExpectedRuleError from './ExpectedRuleError'
import EndOfSourceError from './EndOfSourceError'
import parseRule from './parseRule'
import assert from 'assert'

function parseAll(ctx) {
  const { subRule } = ctx.rule

  const nextCtx = Object.create(ctx)
  nextCtx.rule = subRule

  const match = parseRule(nextCtx)

  if (! match)
    throw ExpectedRuleError(ctx)

  assert.equal(typeof match.inc, 'number')

  if (ctx.index + match.inc < ctx.tokens.length) {
    nextCtx.index += match.inc
    throw EndOfSourceError(nextCtx)
  }

  return {
    value: {
      node: match.value,
      type: ctx.rule.type,
    },
    inc: match.inc,
  }
}

export default parseAll
