import convertSyntax from '@adrianhelvik/convert-syntax'
import parseRule from './parseRule'

function parse({ syntax, tokens, source, rule = 'main' } = {}) {
  const rules = convertSyntax(syntax)
  const _rule = rules.get(rule)

  const ctx = {
    optional: 0,
    index: 0,
    tokens,
    source,
    rule: _rule,
  }

  const match = parseRule(ctx)

  return match.value
}

export default parse
