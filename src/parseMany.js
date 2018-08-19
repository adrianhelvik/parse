import parseSequence from './parseSequence'
import parseEither from './parseEither'
import parseOne from './parseOne'
import JSON from 'circular-json'
import assert from 'assert'

function parseMany({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
  delimiter,
}) {
  const nodes = []
  let incrementIndex = 0

  switch (rule.ruleType) {
    case 'lex':
      {
        while (tokens[index+incrementIndex].type === rule.type) {
          nodes.push(tokens[index+incrementIndex])
          incrementIndex += 1
          if (delimiter) {
            const delimiterResult = parseOne({
              index: index + incrementIndex,
              source,
              tokens,
              rule: delimiter,
            })
            if (! delimiterResult)
              break
            else {
              incrementIndex += delimiterResult.incrementIndex
              nodes.push(delimiterResult.node)
            }
          }
        }
      }
      break
    case 'sequence':
      {
        let match
        while (
          match = parseSequence({
            shouldThrow: 'not eof',
            index: index+incrementIndex,
            source,
            rule: rule.subRule,
            tokens,
            type: rule.type,
          })
        ) {
          nodes.push({
            type: rule.type,
            nodes: match.nodes,
          })
          incrementIndex += match.incrementIndex
          if (delimiter) {
            const delimiterResult = parseOne({
              index: index + incrementIndex,
              source,
              tokens,
              rule: delimiter,
            })
            if (! delimiterResult)
              break
            else {
              incrementIndex += delimiterResult.incrementIndex
              nodes.push(delimiterResult.node)
            }
          }
        }
      }
      break
    case 'either':
      {
        let match
        while (
          match = parseEither({
            shouldThrow: 'not eof',
            index: index+incrementIndex,
            source,
            rule: rule.subRule,
            tokens,
            type: rule.type,
          })
        ) {
          if (Array.isArray(match.nodes)) {
            nodes.push({
              type: rule.type,
              nodes: match.nodes,
            })
          } else {
            nodes.push({
              type: rule.type,
              node: match.node,
            })
          }

          if (typeof match.incrementIndex !== 'number')
            throw Error('Got non-numeric incrementIndex')
          if (isNaN(match.incrementIndex))
            throw Error('Got NaN incrementIndex')

          incrementIndex += match.incrementIndex
          if (delimiter) {
            const delimiterResult = parseOne({
              index: index + incrementIndex,
              source,
              tokens,
              rule: delimiter,
            })
            if (! delimiterResult)
              break
            else {
              incrementIndex += delimiterResult.incrementIndex
              nodes.push(delimiterResult.node)
            }
          }
        }
      }
      break
    default:
      throw Error(`Invalid rule type: ${rule.ruleType}`)
  }

  return {
    incrementIndex,
    nodes,
  }
}

export default parseMany
