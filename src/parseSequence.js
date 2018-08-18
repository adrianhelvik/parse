import parseEither from './parseEither'

function parseSequence({
  index = 0,
  source,
  tokens,
  rule,
}) {
  const nodes = []
  let incrementIndex = 0

  for (let i = 0; i < rule.length; i++) {
    if (i + index > tokens.length)
      return null

    switch (rule[i].ruleType) {
      case 'lex':
        {
          if (rule[i].type !== tokens[index+incrementIndex].type) {
            if (! rule[i].optional)
              return null
          } else {
            nodes.push(tokens[index+incrementIndex])
            incrementIndex += 1
          }
        }
        break
      case 'sequence':
        {
          const parsed = parseSequence({
            index: index + i,
            source,
            tokens,
            rule: rule[i].subRule,
          })
          nodes.push({
            type: rule[i].type,
            nodes: parsed.nodes,
          })
          incrementIndex += parsed.incrementIndex
        }
        break
      case 'either':
        {
          const parsed = parseEither({
            index: index + i,
            source,
            tokens,
            rule: rule[i].subRule,
          })
          nodes.push({
            type: rule[i].type,
            node: parsed.node,
          })
          incrementIndex = parsed.incrementIndex
        }
        break
      default:
        throw Error(`Unknown rule type: ${rule[i].ruleType}`)
    }
  }

  return {
    incrementIndex,
    nodes,
  }
}

export default parseSequence
