import lex from '@adrianhelvik/lex'
import parse from './parse'

it('can parse lex types', () => {
  const syntax = {
    lex: [
      ['ident', /^[a-zA-Z]+/],
      ['whitespace', /^[\s]+/, 'ignore'],
    ],
    parse: {
      main: ['many', 'statement'],
      statement: ['either', [
        'funcCall',
      ]],
      expression: ['either', [
        'funcCall',
        'ident',
      ]],
      funcCall: ['sequence', [
        'ident',
        'expression',
      ]],
    }
  }

  const source = 'foo bar baz'
  const tokens = lex({ source, syntax })

  const node = parse({
    source,
    syntax,
    tokens,
  })

  expect(node).toEqual({
    type: 'main',
    nodes: [
      {
        type: 'statement',
        node: {
          type: 'funcCall',
          nodes: [
            {
              index: 0,
              value: 'foo',
              type: 'ident',
            },
            {
              type: 'expression',
              node: {
                type: 'funcCall',
                nodes: [
                  {
                    type: 'ident',
                    value: 'bar',
                    index: 4,
                  },
                  {
                    type: 'expression',
                    node: {
                      type: 'ident',
                      value: 'baz',
                      index: 8,
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  })
})
