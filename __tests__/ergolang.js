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

test('case b', () => {
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
      varDecl: ['sequence', [
        'keyword:let',
        'symbol:=',
        'expression',
      ]]
    }
  }

  const source = `let foo = 10`
  const tokens = lex({ source, syntax })

  expect(() => {
    parse({ source, tokens, syntax })
  }).toThrow(/Expected either funcCall or varDecl while parsing statement. Got keyword/)
})

test('case c', () => {
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
        'list',
      ]],
      number: ['either', [
        'integer',
        'double',
      ]],
      varDecl: ['sequence', [
        'keyword:let',
        'ident',
        'symbol:=',
        'expression',
      ]],
      list: ['sequence', [
        'symbol:[',
        'listItems',
        'symbol:]',
      ]],
      listItems: ['many', 'expression', 'symbol:,'],
    }
  }

  convertSyntax(syntax)
})

test('case d', () => {
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
        'list',
      ]],
      number: ['either', [
        'integer',
        'double',
      ]],
      varDecl: ['sequence', [
        'keyword:let',
        'ident',
        'symbol:=',
        'expression',
      ]],
      list: ['sequence', [
        'symbol:[',
        'listItems',
        'symbol:]',
      ]],
      listItems: ['many', 'expression', 'symbol:,'],
    }
  }

  const source = `let foo = []`

  const tokens = lex({ source, syntax })
  const ast = parse({ tokens, source, syntax })

  expect(ast).toEqual(
    {
      type: 'main',
      nodes: [
        {
          type: 'statement',
          node: {
            type: 'varDecl',
            nodes: [
              { value: 'let', type: 'keyword', index: 0 },
              { value: 'foo', type: 'ident', index: 4 },
              { value: '=', type: 'symbol', index: 8 },
              {
                type: 'expression',
                node: {
                  type: 'list',
                  nodes: [
                    {
                      type: 'symbol',
                      value: '[',
                      index: 10,
                    },
                    {
                      type: 'listItems',
                      nodes: [],
                    },
                    {
                      type: 'symbol',
                      value: ']',
                      index: 11,
                    },
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  )
})
