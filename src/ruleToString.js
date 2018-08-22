function ruleToString(rule) {
  if (rule.value)
    return `${rule.type} "${rule.value}"`
  if (rule.type === 'anonymous') {
    switch (rule.ruleType) {
      case 'optional':
        return `optional ${ruleToString(rule.subRule)}`
      case 'one_plus':
        return `one or more ${ruleToString(rule.subRule)}`
      default:
        return `anonymous ${rule.ruleType}`
    }
  }
  return rule.type
}

export default ruleToString
