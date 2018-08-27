import ExpectedRuleError from './ExpectedRuleError'
import parseRule from './parseRule'

function parseEither(ctx) {
  for (let subRule of ctx.rule.subRule) {
    const nextCtx = Object.create(ctx)
    nextCtx.optional += 1
    nextCtx.rule = subRule
    const match = parseRule(nextCtx)
    if (match) {
      return {
        inc: match.inc,
        value: {
          type: ctx.rule.type,
          node: match.value,
        }
      }
    }
  }
  if (! ctx.optional)
    throw ExpectedRuleError(ctx)
  return null
}

export default parseEither
