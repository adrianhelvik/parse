import convertSyntax from '@adrianhelvik/convert-syntax'
import parseRule from './parseRule'

function parse({ syntax, tokens, source }) {
  const rule = convertSyntax(syntax)

  const ctx = {
    optional: 0,
    level: 0,
    index: 0,
    tokens,
    source,
    rule,
    log: [],
  }

  try {
    const match = parseRule(ctx)
    return match.value
  } catch (e) {
    console.log(ctx.log.join('\n'))
    throw e
  }
}

export default parse
