import ruleToString from './ruleToString'

function whileEvaluating(ctx) {
  if (! ctx.__proto__ || ! ctx.__proto__.rule)
    return ''
  return ` while evaluating ${ruleToString(ctx.__proto__.rule)}${within(ctx.__proto__)}`
}

function within(ctx) {
  if (! ctx.__proto__ || ! ctx.__proto__.rule)
    return ''
  return ` within ${ruleToString(ctx.__proto__.rule)}${within(ctx.__proto__)}`
}


export default whileEvaluating
