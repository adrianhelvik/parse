import splitFirst from './splitFirst'
import JSON from 'circular-json'
import assert from 'assert'

function convertSyntax(syntax) {
  const rulesMap = new Map()
  const shallowRules = []

  for (const ruleSchema of syntax.lex) {
    addLexRule(ruleSchema)
  }

  for (const type of Object.keys(syntax.parse))
    addShallowParseRule(type, syntax.parse[type])

  for (const rule of shallowRules)
    populateRule(rule)

  return rulesMap.get('main')

  function addLexRule(ruleSchema) {
    const type = ruleSchema[0]
    rulesMap.set(type, {
      type,
      ruleType: 'lex',
    })
  }

  function addShallowParseRule(type, ruleSchema) {
    const rule = {
      ruleType: ruleSchema[0],
      type,
      ruleSchema,
    }
    rulesMap.set(type, rule)
    shallowRules.push(rule)
  }

  function populateRule(rule) {
    if (rule._populated)
      return
    Object.defineProperty(rule, '_populated', {
      value: true
    })
    switch (rule.ruleType) {
      case 'either':
      case 'sequence':
        populateMultiRule(rule)
        break
      case 'one':
        populateOneRule(rule)
        break
      case 'many':
        populateManyRule(rule)
        break
      case 'zero_plus':
        populateZeroPlus(rule)
        break
      case 'one_plus':
        populateOnePlus(rule)
        break
      default:
        throw Error(`Unknown rule type: "${rule.ruleType}"`)
    }

    delete rule.ruleSchema
  }

  function populateManyRule(rule) {
    const { ruleSchema } = rule
    const subType = ruleSchema[1]
    const delimiter = ruleSchema[2]

    rule.subRule = lookupRule(subType)

    if (delimiter) {
      rule.delimiter = lookupRule(delimiter)
    }
  }

  function populateOneRule(rule) {
    const { ruleSchema } = rule
    const subType = ruleSchema[1]

    rule.subRule = lookupRule(subType)
  }

  function populateZeroPlus(rule) {
    const { ruleSchema } = rule
    const subType = ruleSchema[1]

    rule.subRule = lookupRule(subType)
  }

  function populateOnePlus(rule) {
    const { ruleSchema } = rule
    const subType = ruleSchema[1]

    rule.subRule = lookupRule(subType)
  }

  function populateMultiRule(rule) {
    const subType = rule.ruleSchema[1]
    rule.subRule = []

    let verified = false
    for (const part of subType) {
      if (typeof part === 'string') {
        if (part === 'VERIFIED')
          verified = true
        else {
          let subRule = lookupRule(part)
          if (verified) {
            subRule = Object.create(subRule)
            subRule.verified = true
          }
          rule.subRule.push(subRule)
        }
      } else {
        populateRule(rule)
      }
    }
  }

  function lookupRule(x) {
    if (! x)
      throw Error('Cannot lookup ' + x)

    if (Array.isArray(x)) {
      const rule = {
        ruleType: x[0],
        type: 'anonymous',
        ruleSchema: x[1],
      }
      populateRule(rule)
      return rule
    }

    const [key, value] = splitFirst(x, ':')
    let subRule

    if (value) {
      subRule = Object.create(rulesMap.get(key))
      if (subRule)
        subRule.value = value
    } else {
      subRule = rulesMap.get(x)
    }

    if (! subRule)
      throw Error(`lookupRule: Failed to lookup rule: ${JSON.stringify(key)}`)

    return subRule
  }
}

export default convertSyntax
