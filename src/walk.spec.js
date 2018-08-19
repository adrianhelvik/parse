import lex from '@adrianhelvik/lex'
import parse from './parse'
import walk from './walk'

it('can walk nodes', () => {
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

  const { node } = parse({
    source,
    syntax,
    tokens,
  })

  walk(node, node => {
    expect(node).toBeObject()
    delete node.index
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
                  },
                  {
                    type: 'expression',
                    node: {
                      type: 'ident',
                      value: 'baz',
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
