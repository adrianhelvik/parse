import parseSequence from './parseSequence'
import trace from '@adrianhelvik/trace'
import parseLex from './parseLex'

function parseEither({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
  type,
}) {
  if (isNaN(index)) throw Error('Got NaN as index')

  if (index >= tokens.length) {
    if (shouldThrow && shouldThrow !== 'not eof') {
      throw Error(trace(
        source,
        source.length,
        `Expected ${orify(rule)}, ` +
        `but reached the end of the source.`
      ))
    }
    return null
  }

  for (let subRule of rule) {
    switch (subRule.ruleType) {
      case 'lex':
        {
          const match = parseLex({
            index,
            source,
            tokens,
            rule: subRule,
            type,
          })
          if (match) {
            return {
              node: match.node,
              incrementIndex: match.incrementIndex,
            }
          }
        }
        break
      case 'either':
        {
          const match = parseEither({
            index,
            source,
            tokens,
            rule: subRule.subRule,
          })

          if (match) {
            return {
              incrementIndex: match.incrementIndex,
              node: {
                type: subRule.type,
                node: match.node,
              }
            }
          }
        }
        break
      case 'sequence':
        {
          const match = parseSequence({
            shouldThrow: false,
            index,
            source,
            tokens,
            rule: subRule.subRule,
            type: subRule.type,
          })

          if (match) {
            return {
              incrementIndex: match.incrementIndex,
              node: {
                type: subRule.type,
                nodes: match.nodes
              }
            }
          }
        }
        break
      default:
        throw Error(`Unknown rule type: ${subRule.ruleType}`)
    }
  }

  if (shouldThrow) {
    throw Error(trace(
      source,
      tokens[index].index,
      `Expected ${orify(rule, tokens[index])} while parsing ${type}. Got ${tokenString(tokens[index], rule)}.`
    ))
  }

  return null
}

export default parseEither

function orify(rule, token) {
  if (rule.length === 1)
    return ruleString(rule[0])

  const result = ['either']

  result.push(ruleString(rule[0], token))

  for (let i = 1; i < rule.length - 1; i++) {
    result[result.length-1] += ','
    result.push(ruleString(rule[i], token))
  }

  if (rule.length > 1) {
    result.push('or')
    result.push(ruleString(rule[rule.length-1], token))
  }

  return result.join(' ')
}

function ruleString(rule, token) {
  if (rule.value) {
    if (token && token.value === rule.value)
      return '"' + rule.value + `" of type ${rule.type}`
    return '"' + rule.value + '"'
  }
  return rule.type
}

function tokenString(token, rule) {
  return token.type + ' "' + token.value + '"'
}
