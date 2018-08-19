import parseSequence from './parseSequence'
import parseEither from './parseEither'
import JSON from 'circular-json'
import assert from 'assert'

function parseMany({
  index = 0,
  source,
  tokens,
  rule,
}) {
  const nodes = []
  let incrementIndex = 0

  switch (rule.ruleType) {
    case 'lex':
      {
        while (tokens[index+incrementIndex].type === rule.type) {
          nodes.push(tokens[index+incrementIndex])
          incrementIndex += 1
        }
      }
      break
    case 'sequence':
      {
        let match
        while (
          match = parseSequence({
            index: index+incrementIndex,
            source,
            rule: rule.subRule,
            tokens,
          })
        ) {
          nodes.push({
            type: rule.type,
            nodes: match.nodes,
          })
          incrementIndex += match.incrementIndex
        }
      }
      break
    case 'either':
      {
        let match
        while (
          match = parseEither({
            index: index+incrementIndex,
            source,
            rule: rule.subRule,
            tokens,
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
          incrementIndex += match.incrementIndex
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
