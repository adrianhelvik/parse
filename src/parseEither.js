import parseSequence from './parseSequence'
import trace from '@adrianhelvik/trace'

function parseEither({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
  type,
}) {
  if (index >= tokens.length) {
    if (shouldThrow && shouldThrow !== 'not eof') {
      throw Error(trace(
        source,
        source.length,
        `Expected ${orify(rule.map(r => r.type))}, ` +
        `but reached the end of the source.`
      ))
    }
    return null
  }

  for (let subRule of rule) {
    switch (subRule.ruleType) {
      case 'lex':
        {
          if (subRule.type === tokens[index].type) {
            return {
              node: tokens[index],
              incrementIndex: 1,
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
      `Expected ${orify(rule.map(r => r.type))} while parsing ${type}. Got ${tokens[index].type}.`
    ))
  }

  if (shouldThrow)
    throw Error('...')

  return null
}

export default parseEither

function orify(array) {
  if (array.length === 1)
    return array[0]

  const result = ['either']

  result.push(array[0])

  for (let i = 1; i < array.length - 1; i++) {
    result.push(',')
    result.push(array[i])
  }

  if (array.length > 1) {
    result.push('or')
    result.push(array[array.length-1])
  }

  return result.join(' ')
}
