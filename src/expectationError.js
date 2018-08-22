import trace from '@adrianhelvik/trace'
import JSON from 'circular-json'

export default function expectationError({
  sequenceMatch,
  sequenceRule,
  source,
  token,
  rule,
}) {
  console.log(rule)
  const val = rule.value
    ? ` "${rule.value}"`
    : ''

  let message

  if (sequenceRule) {

  }

  switch (rule.ruleType) {
    case 'sequence':
      const matchedValues = sequenceMatch
        .map(m => '"' + m.value + '"')
        .join(' -> ')
      message = `Did not find a ${rule.type}.\n\nExpected the sequence:\n${sequenceRule.map(m => m.value ? `${m.type} "${m.value}"` : m.type).join(' -> ')}\n\nBut was stopped at:\n${matchedValues}\n`
      break
    case 'either':
      const values = rule.subRule
        .map(x => x.type)
      message = `Expected either ${or(values)}, but got ${token.type} "${token.value}"`
      break
    default:
      message = `Expected ${rule.type}${val}, but got ${token.type} "${token.value}".`
  }

  throw Error(trace(
    source,
    token.index,
    message,
  ))
}

function or(array) {
  let result = ''
  for (let i = 0; i < array.length - 1; i++)
    result += array[i] + ', '
  if (result) {
    result = result.substring(0, result.length-2)
    result += ' or ' + array[array.length-1]
  } else {
    result = array[array.length-1]
  }
  return result
}
