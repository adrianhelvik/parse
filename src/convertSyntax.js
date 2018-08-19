import JSON from 'circular-json'

function convertSyntax(syntax) {
  const rulesMap = new Map()
  const unresolved = []

  for (const ruleSchema of syntax.lex) {
    const type = ruleSchema[0]
    rulesMap.set(type, {
      type,
      ruleType: 'lex',
    })
  }

  for (const type of Object.keys(syntax.parse)) {
    const ruleSchema = syntax.parse[type]
    const rule = {
      type,
      ruleType: null,
    }
    let subRuleSchema

    for (const part of ruleSchema) {
      if (part === 'sequence')
        rule.ruleType = 'sequence'
      else if (part === 'either')
        rule.ruleType = 'either'
      else if (part === 'many')
        rule.ruleType = 'many'
      else if (Array.isArray(part)) {
        if (subRuleSchema)
          throw Error('Attempted to overwrite subRuleSchema')
        subRuleSchema = part
      }
      else if (typeof part === 'string') {
        if (subRuleSchema)
          throw Error('Attempted to overwrite subRuleSchema')
        subRuleSchema = part
      }
    }

    if (rule.ruleType === 'many' && typeof subRuleSchema !== 'string') {
      throw Error('Invalid many-rule. The correct format is ["many","someRule"]. Got: ' + JSON.stringify(syntax.parse[type]))
    }

    rulesMap.set(type, rule)
    unresolved.push({
      type,
      subRuleSchema,
    })
  }

  for (const { type, subRuleSchema } of unresolved) {
    const rule = rulesMap.get(type)

    if (rule.ruleType === 'sequence' || rule.ruleType === 'either') {
      const subRule = []
      for (const subRuleType of subRuleSchema)
        subRule.push(rulesMap.get(subRuleType))
      rule.subRule = subRule
    } else {
      const subRule = rulesMap.get(subRuleSchema)
      rule.subRule = subRule
    }
  }

  return rulesMap.get('main')
}

export default convertSyntax
