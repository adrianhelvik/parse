import convertSyntax from '@adrianhelvik/convert-syntax'
import trace from '@adrianhelvik/trace'
import parseOne from './parseOne'

function parse({
  index = 0,
  source,
  tokens,
  syntax,
}) {
  const rule = convertSyntax(syntax)

  const parsed = parseOne({
    index,
    source,
    tokens,
    rule,
    shouldThrow: true,
  })

  if (! parsed) {
    throw Error(trace(source, 0, 'Parsing did not complete'))
  }

  const { incrementIndex, nodes, node } = parsed

  if (index+incrementIndex < tokens.length) {
    console.log(incrementIndex)
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
