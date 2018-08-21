import trace from '@adrianhelvik/trace'

export default function expectationError({
  token,
  source,
  message,
  rule,
}) {
  const val = rule.value
    ? ` "${rule.value}"`
    : ''
  throw Error(trace(
    source,
    token.index,
    `Expected ${rule.type}${val}, but got ${token.type} "${token.value}".`
  ))
}
