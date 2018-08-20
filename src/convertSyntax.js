import splitFirst from './splitFirst'
import JSON from 'circular-json'
import assert from 'assert'

function convertSyntax(syntax) {
  const rulesMap = new Map()
  const unresolvedDelimiters = []
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

    if (ruleSchema[0] === 'many') {
      subRuleSchema = ruleSchema[1]
      rule.ruleType = 'many'
      if (ruleSchema.length >= 3) {
        unresolvedDelimiters.push({
          delimiter: ruleSchema[2],
          rule,
        })
      }
    } else {
      for (const part of ruleSchema) {
        if (part === 'sequence')
          rule.ruleType = 'sequence'
        else if (part === 'either')
          rule.ruleType = 'either'
        else if (Array.isArray(part)) {
          if (subRuleSchema)
            throw Error('Attempted to overwrite existing subRuleSchema ' + JSON.stringify(subRuleSchema) + ' with ' + JSON.stringify(part))
          subRuleSchema = part
        }
        else if (typeof part === 'string') {
          if (subRuleSchema)
            throw Error('Attempted to overwrite existing subRuleSchema ' + JSON.stringify(subRuleSchema) + ' with ' + JSON.stringify(part))
          else
            subRuleSchema = part
        }
      }
    }

    if (rule.ruleType === 'many' && typeof subRuleSchema !== 'string') {
      throw Error('Invalid many-rule. The correct format is [string, string, string?]. Got: ' + JSON.stringify(syntax.parse[type]))
    }

    rulesMap.set(type, rule)
    unresolved.push({
      type,
      subRuleSchema,
    })
  }

  for (const { type, subRuleSchema } of unresolved) {
    const rule = rulesMap.get(type)
    let markAsVerified = false

    if (rule.ruleType === 'sequence' || rule.ruleType === 'either') {
      const subRule = []
      for (const subRuleTypeValue of subRuleSchema) {
        if (subRuleTypeValue === 'VERIFIED') {
          markAsVerified = true
          continue
        }

        const [subRuleType, subRuleValue] = splitFirst(subRuleTypeValue, ':')
        let subSubRule = rulesMap.get(subRuleType)
        assert(
          subSubRule,
          `Could not resolve ${subRuleType} in schema `
          + JSON.stringify(syntax.parse[type] || syntax.lex[type])
        )
        if (subRuleValue) {
          subSubRule = Object.create(subSubRule)
          subSubRule.value = subRuleValue
        }
        if (markAsVerified) {
          subSubRule = Object.create(subSubRule)
          subSubRule.verified = true
        }
        subRule.push(subSubRule)
      }
      rule.subRule = subRule
    } else {
      const subRule = rulesMap.get(subRuleSchema)
      rule.subRule = subRule
    }
  }

  for (const { delimiter, rule } of unresolvedDelimiters) {
    const [type, value] = splitFirst(delimiter, ':')

    const delimiterRule = rulesMap.get(type)

    if (value)
      rule.delimiter = {
        ...delimiterRule,
        value,
      }
    else
      rule.delimiter = delimiterRule
  }

  return rulesMap.get('main')
}

export default convertSyntax
