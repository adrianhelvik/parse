import trace from '@adrianhelvik/trace'

function parseLex({
  shouldThrow,
  index = 0,
  source,
  tokens,
  rule,
  type,
}) {
  if (isNaN(index)) throw Error('Got NaN as index')
  if (index >= tokens.length) {
    if (shouldThrow) {
      throw Error(trace(source, source.length,
        `Expected ${rule.type}${rule.value ? ` "${rule.value}"` : ``}. Reached end of source.`
      ))
    }
    return null
  }

  const token = tokens[index]

  if (rule.value) {
    const isMatch = (
      rule.type === token.type
      && rule.value === token.value
    )

    if (! isMatch) {
      if (shouldThrow) {
        console.log(tokens, index)
        throw Error(trace(source, token.index,
          `Expected ${rule.type} "${rule.value}", but got ${token.type} "${token.value}"${postfix()}.`
        ))
      }
      return null
    }
  }

  if (rule.type !== token.type) {
    if (shouldThrow)
      throw Error(trace(source, token.index,
        `Expected ${rule.type}, but got ${token.type} "${token.value}"${postfix()}.`
      ))
    return null
  }

  return {
    node: token,
    incrementIndex: 1,
  }

  function postfix() {
    if (! type)
      return ''
    return ` while parsing ${type}`
  }
}

export default parseLex
