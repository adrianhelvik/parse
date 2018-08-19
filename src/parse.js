import convertSyntax from './convertSyntax'
import trace from '@adrianhelvik/trace'
import parseOne from './parseOne'

function parse({
  index = 0,
  source,
  tokens,
  syntax,
}) {
  const rule = convertSyntax(syntax)

  const {
    incrementIndex,
    nodes,
    node,
  } = parseOne({
    index,
    source,
    tokens,
    rule,
    shouldThrow: true
  })

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
