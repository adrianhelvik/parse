import trace from '@adrianhelvik/trace'

function ExpectedRuleError(ctx) {
  const message = `Expected ${ctx.rule.type} ${ctx.rule.ruleType}`
  return Error(trace(ctx.source, ctx.tokens[ctx.index].index, message))
}

export default ExpectedRuleError
