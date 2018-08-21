import convertSyntax from '../../src/convertSyntax'
import syntax from '../../pascal/syntax'
import lex from '@adrianhelvik/lex'
import JSON from 'circular-json'
import parse from '../../src'
import fs from 'fs'

const source = fs.readFileSync(__dirname + '/../../pascal/primes.pas', 'utf-8')

it('can lex the syntax', () => {
  const tokens = lex({ source, syntax })
  // console.log(tokens)
})

it('can convert the syntax', () => {
  const mainRule = convertSyntax(syntax)
  expect(mainRule.subRule[3].subRule[0].ruleType).toBe('optional')
  // console.log(JSON.stringify(mainRule, null, 2))
})

describe('part of syntax a', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z][a-zA-Z0-9]*/],
      ['whitespace', /^[\s]+/, 'ignore'],
    ],
    parse: {
      main: ['sequence', [
        ['optional', 'word:foo'],
        ['optional', 'word:bar'],
      ]],
    }
  }

  const _ = source => {
    const tokens = lex({ source, syntax })
    return parse({ tokens, source, syntax })
  }

  test('(empty)', () => {
    _('')
  })
  test('foo', () => {
    _('foo')
  })
  test('bar', () => {
    _('bar')
  })
  test('foo bar', () => {
    _('foo bar')
  })
})

xit('can parse the syntax', () => {
  const source = fs.readFileSync(__dirname + '/../../pascal/primes.pas', 'utf-8')
  const tokens = lex({ source, syntax })

  parse({ tokens, source, syntax })
})
