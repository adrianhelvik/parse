import ruleToString from './ruleToString'
import trace from '@adrianhelvik/trace'

function ExpectedRuleError(ctx) {
  const message = `Expected ${ruleToString(ctx.rule)}`
  return Error(trace(ctx.source, ctx.tokens[ctx.index].index, message))
}

export default ExpectedRuleError
