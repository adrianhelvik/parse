import convertSyntax from '@adrianhelvik/convert-syntax'
import parseRule from './parseRule'

function parse({ syntax, tokens, source }) {
  const rule = convertSyntax(syntax)

  const ctx = {
    index: 0,
    tokens,
    source,
    rule,
  }

  const match = parseRule(ctx)

  return match.value
}

export default parse
