import ruleToString from './ruleToString'

function whileEvaluating(ctx) {
  if (! ctx || ! ctx.rule)
    return ''
  return ` while evaluating ${ruleToString(ctx.rule)}${within(ctx.__proto__)}`
}

function within(ctx) {
  if (! ctx || ! ctx.rule)
    return ''
  return `\nwithin ${ruleToString(ctx.rule)}${within(ctx.__proto__)}`
}


export default whileEvaluating
