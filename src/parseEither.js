import parseSequence from './parseSequence'

function parseEither({
  index = 0,
  source,
  tokens,
  rule,
}) {
  if (index >= tokens.length)
    return null

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
  return null
}

export default parseEither
