import lex from '@adrianhelvik/lex'
import parse from '.'

test('infinite loop condition', () => {
  const syntax = {
    lex: [
      ['comment', /^#.*\n/],
      ['string', /^"((\\")|[^"])+"/],
      ['string', /^'((\\')|[^'])+'/],
      ['whitespace', /^\s+/, 'ignore'],
      ['keyword', /^(from|import|export|let|or|and|xor|fn)(?![a-zA-Z0-9_$])/],
      ['ident', /^[a-zA-Z][a-zA-Z0-9]*/],
      ['integer', /^[1-9][0-9]*/],
      ['double', /^([1-9][0-9]*)?\.[0-9]+/],
      ['symbol', /^(\+\+|[+\-*/.={}(),])/],
    ],
    parse: {
      main: ['zero_plus', ['either', [
        'statement',
        'import',
        'export',
      ]]],
      import: ['either', [
        ['sequence', [
          'keyword:import',
          'ident',
          'keyword:from',
          'string',
        ]],
        ['sequence', [
          'keyword:import',
          'string',
        ]],
      ]],
      export: ['sequence', [
        'keyword:export',
        'ident',
      ]],
      statement: ['either', [
        'varDecl',
        'funcCall',
      ]],
      dotaccess: ['sequence', [
        'expression',
        'symbol:.',
        'expression',
      ]],
      expression: ['either', [
        'funcCallOrVariable',
        'touple',
        'function',
        'integer',
        'double',
        'dotaccess',
      ]],
      funcCallOrVariable: ['sequence', [
        'ident',
        ['optional', 'expression']
      ]],
      touple: ['sequence', [
        'symbol:(',
        ['one_plus', 'expression', 'symbol:,'],
        'symbol:)',
      ]],
      function: ['sequence', [
        'keyword:fn',
        'VERIFIED',
        'symbol:{',
        ['zero_plus', 'statement'],
        'symbol:}',
      ]],
      varDecl: ['sequence', [
        'keyword:let',
        'VERIFIED',
        'ident',
        ['optional', ['sequence', [
          'symbol:=',
          'VERIFIED',
          'expression',
        ]]],
      ]],
      funcCall: ['sequence', [
        'ident',
        'expression',
      ]]
    }
  }
  const source = 'let x = add(1, 2)'
  const tokens = lex({ source, syntax })

  expect(() => {
    parse({ tokens, source, syntax })
  }).toThrow(/let x = add\(1, 2\)\n.+Infinite recursion/m)
})
