import parseSequence from './parseSequence'
import parseEither from './parseEither'
import trace from '@adrianhelvik/trace'
import parseMany from './parseMany'
import parseLex from './parseLex'
import JSON from 'circular-json'
import assert from 'assert'

function parse({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
}) {
  let result

  switch (rule.ruleType) {
    case 'lex':
      return parseLex({
        index,
        source,
        tokens,
        rule,
        shouldThrow,
      })
    case 'many':
      return parseMany({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'either':
      return parseEither({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'sequence':
      return parseSequence({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'one':
      return parseOne({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    default:
      throw Error(`Invalid rule type: ${rule.ruleType}`)
  }

  const {
    incrementIndex,
    nodes,
    node,
  } = result

  if (nodes) {
    return {
      incrementIndex,
      node: {
        type: rule.type,
        nodes,
      }
    }
  }

  return {
    incrementIndex,
    node: {
      type: rule.type,
      node,
    }
  }
}

export default parse
