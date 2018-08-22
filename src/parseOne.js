import parseSequence from './parseSequence'
import parseOnePlus from './parseOnePlus'
import parseEither from './parseEither'
import trace from '@adrianhelvik/trace'
import parseMany from './parseMany'
import parseLex from './parseLex'
import JSON from 'circular-json'
import assert from 'assert'

function parseOne({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
}) {
  let result

  switch (rule.ruleType) {
    case 'lex':
      result = parseLex({
        index,
        source,
        tokens,
        rule,
        shouldThrow,
      })
      break
    case 'many':
      result = parseMany({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'either':
      result = parseEither({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'sequence':
      result = parseSequence({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'one':
      result = parseOne({
        index,
        source,
        tokens,
        rule: rule.subRule,
        shouldThrow,
      })
      break
    case 'one_plus':
      result = parseOnePlus({
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

  return result
}

export default parseOne
