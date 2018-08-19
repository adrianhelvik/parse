import convertSyntax from './convertSyntax'
import parseSequence from './parseSequence'
import parseEither from './parseEither'
import trace from '@adrianhelvik/trace'
import parseMany from './parseMany'
import JSON from 'circular-json'
import assert from 'assert'

function parse({
  index = 0,
  source,
  tokens,
  syntax,
}) {
  const rule = convertSyntax(syntax)
  let result

  switch (rule.ruleType) {
    case 'many':
      result = parseMany({
        index,
        source,
        tokens,
        syntax,
        rule: rule.subRule,
      })
      break
    case 'either':
      result = parseEither({
        index,
        source,
        tokens,
        syntax,
        rule: rule.subRule,
      })
      break
    case 'sequence':
      result = parseSequence({
        index,
        source,
        tokens,
        syntax,
        rule: rule.subRule,
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

  if (index+incrementIndex < tokens.length) {
    console.log(JSON.stringify(nodes || node, null, 2))
    throw Error(trace(source, tokens[index+incrementIndex].index, 'Parsing did not complete'))
  }

  if (nodes) {
    return {
      type: rule.type,
      nodes,
    }
  }

  return {
    type: rule.type,
    node,
  }
}

export default parse
