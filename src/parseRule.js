import parseOptional from './parseOptional'
import parseZeroPlus from './parseZeroPlus'
import parseSequence from './parseSequence'
import ruleToString from './ruleToString'
import parseOnePlus from './parseOnePlus'
import parseEither from './parseEither'
import parseOne from './parseOne'
import parseLex from './parseLex'

function parseRule(ctx) {
  const subCtx = Object.create(ctx)

  if (ctx.rule.type !== 'anonymous')
    subCtx.level += 1

  const parentLog = ctx.log

  let log = ctx.log = []
  let match

  const type = ctx.rule.type === 'anonymous'
    ? 'anonymous-' + ctx.rule.ruleType
    : ctx.rule.type

  const tag = ctx.rule.value
    ? type + ':' + ctx.rule.value
    : type

  if (ctx.rule.type !== 'anonymous')
    log.push('  '.repeat(ctx.level) + '<' + tag + '>')

  try {
    switch (subCtx.rule.ruleType) {
      case 'one':
        match = parseOne(subCtx)
        break
      case 'lex':
        match = parseLex(subCtx)
        break
      case 'either':
        match = parseEither(subCtx)
        break
      case 'sequence':
        match = parseSequence(subCtx)
        break
      case 'optional':
        match = parseOptional(subCtx)
        break
      case 'one_plus':
        match = parseOnePlus(subCtx)
        break
      case 'zero_plus':
        match = parseZeroPlus(subCtx)
        break
      default:
        if (Array.isArray(subCtx.rule))
          throw Error(`Expected rule. Got array within: ${ruleToString(ctx.__proto__.rule)}`)
        throw Error(`Unknown rule type: ${ruleToString(subCtx.rule)}`)
        break
    }
  } catch (e) {
    throw e
  }

  if (ctx.rule.type !== 'anonymous') {
    if (! match) {
      log.push('  '.repeat(ctx.level) + '  NO MATCH')
    } else if (match.value.value) {
      log.push('  '.repeat(ctx.level) + '  ' + match.value.value)
    }

    log.push('  '.repeat(ctx.level) + '</' + tag + '>')
  }

  if (match)
    for (const item of log)
      parentLog.push(item)

  return match
}

export default parseRule
