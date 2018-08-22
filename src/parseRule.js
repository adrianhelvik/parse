import parseOptional from './parseOptional'
import parseZeroPlus from './parseZeroPlus'
import parseSequence from './parseSequence'
import parseOnePlus from './parseOnePlus'
import parseEither from './parseEither'
import parseOne from './parseOne'
import parseLex from './parseLex'

function parseRule(ctx) {
  try {
    switch (ctx.rule.ruleType) {
      case 'one':
        return parseOne(ctx)
      case 'lex':
        return parseLex(ctx)
      case 'either':
        return parseEither(ctx)
      case 'sequence':
        return parseSequence(ctx)
      case 'optional':
        return parseOptional(ctx)
      case 'one_plus':
        return parseOnePlus(ctx)
      case 'zero_plus':
        return parseZeroPlus(ctx)
      default:
        break
    }
  } catch (e) {
    if (ctx.optional)
      return null
    throw e
  }

  throw Error('Unknown rule type: ' + ctx.rule.ruleType)
}

export default parseRule
