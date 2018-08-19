import convertSyntax from '../src/convertSyntax'
import lex from '@adrianhelvik/lex'
import parse from '../src/parse'
import JSON from 'circular-json'

test('case a', () => {
  const syntax = {
    lex: [
      ['string', /^'((\\')|[^'])+'/],
      ['whitespace', /^\s+/, 'ignore'],
      ['keyword', /^(let)/],
      ['ident', /^[a-zA-Z][a-zA-Z0-9]*/],
      ['double', /^([1-9][0-9]*)?\.[0-9]+/],
      ['integer', /^[1-9][0-9]*/],
      ['symbol', /^[=\[\],()]/],
    ],
    parse: {
      main: ['many', 'statement'],
      statement: ['either', [
        'funcCall',
        'varDecl',
      ]],
      funcCall: ['sequence', [
        'ident',
        'expression',
      ]],
      expression: ['either', [
        'ident',
        'string',
        'number',
      ]],
      number: ['either', [
        'integer',
        'double',
      ]],
    }
  }

  expect(() => {
    convertSyntax(syntax)
  }).toThrow('Could not resolve varDecl in schema ["either",["funcCall","varDecl"]]')
})
