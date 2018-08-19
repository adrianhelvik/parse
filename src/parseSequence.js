import trace from '@adrianhelvik/trace'
import parseEither from './parseEither'
import parseMany from './parseMany'
import JSON from 'circular-json'

function parseSequence({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
  type,
}) {
  const nodes = []
  let incrementIndex = 0

  for (let i = 0; i < rule.length; i++) {
    if (index + incrementIndex >= tokens.length) {
      if (shouldThrow && shouldThrow !== 'not eof') {
        throw Error(trace(source, source.length,
          `Expected ${rule[i].type}, but reached the end of the source.`
        ))
      }
      return null
    }

    switch (rule[i].ruleType) {
      case 'lex':
        {
          const token = tokens[index+incrementIndex]

          if (
            rule[i].type !== token.type
            || (
              rule[i].value &&
              rule[i].value !== token.value
            )
          ) {
            if (! rule[i].optional) {
              if (shouldThrow) {
                const message = 
                  rule[i].value
                  ? trace(source, token.index,
                    `Expected ${rule[i].value}, but got ${token.value} while parsing ${type}.`
                  )
                  : trace(source, token.index,
                    `Expected ${rule[i].type}, but got ${token.type} while parsing ${type}.`
                  )
                throw Error(message)
              }
              return null
            }
          } else {
            nodes.push(token)
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
            shouldThrow,
            index: index + i,
            source,
            tokens,
            rule: rule[i].subRule,
            type: rule[i].type,
          })
          if (! parsed) {
            if (shouldThrow)
              throw Error('TODO')
            return null
          }
          nodes.push({
            type: rule[i].type,
            node: parsed.node,
          })
          incrementIndex += parsed.incrementIndex
        }
        break
      case 'many':
        {
          const parsed = parseMany({
            shouldThrow,
            index: index + i,
            source,
            tokens,
            rule: rule[i].subRule,
            delimiter: rule[i].delimiter,
            type: rule[i].type,
          })
          if (! parsed) {
            if (shouldThrow)
              throw Error('TODO')
            return null
          }
          nodes.push({
            type: rule[i].type,
            nodes: parsed.nodes,
          })
          incrementIndex += parsed.incrementIndex
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
