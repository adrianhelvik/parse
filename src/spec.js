import lex from '@adrianhelvik/lex'
import parse from '.'

it('can parse one rules and lex rules', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z]+/],
    ],
    parse: {
      main: ['one', 'word'],
    },
  }
  const source = 'foo'
  const tokens = lex({ source, syntax })
  const ast = parse({ tokens, source, syntax })

  expect(ast).toEqual({
    type: 'main',
    node: {
      type: 'word',
      value: 'foo',
      index: 0,
    }
  })
})

it('can parse either rules', () => {
  const syntax = {
    lex: [
      ['one', /^1/],
      ['two', /^2/],
    ],
    parse: {
      main: ['either', [
        'one',
        'two',
      ]],
    },
  }
  const source = '2'
  const tokens = lex({ source, syntax })
  const ast = parse({ tokens, source, syntax })

  expect(ast).toEqual({
    type: 'main',
    node: {
      type: 'two',
      value: '2',
      index: 0,
    }
  })
})

describe('optional rules', () => {
  const syntax = {
    lex: [
      ['one', /^1/],
      ['two', /^2/],
    ],
    parse: {
      main: ['sequence', [
        ['optional', 'one'],
        'two',
      ]],
    },
  }

  test('with optional', () => {
    const source = '12'
    const tokens = lex({ source, syntax })
    const ast = parse({ tokens, source, syntax })

    expect(ast).toEqual({
      type: 'main',
      nodes: [
        {
          type: 'anonymous',
          node: {
            type: 'one',
            value: '1',
            index: 0,
          }
        },
        {
          type: 'two',
          value: '2',
          index: 1,
        },
      ]
    })
  })

  test('without optional', () => {
    const source = '2'
    const tokens = lex({ source, syntax })
    const ast = parse({ tokens, source, syntax })

    expect(ast).toEqual({
      type: 'main',
      nodes: [
        {
          type: 'anonymous',
          node: null
        },
        {
          type: 'two',
          value: '2',
          index: 0,
        },
      ]
    })
  })
})

it('can parse zero_plus rules', () => {
  const syntax = {
    lex: [
      ['one', /^1/],
      ['two', /^2/],
    ],
    parse: {
      main: ['sequence', [
        ['zero_plus', 'one'],
        'two',
        ['zero_plus', 'one'],
        'two',
      ]],
    },
  }
  const source = '122'
  const tokens = lex({ source, syntax })
  const ast = parse({ tokens, source, syntax })

  expect(ast).toEqual({
    type: 'main',
    nodes: [
      {
        type: 'anonymous',
        nodes: [
          {
            type: 'one',
            value: '1',
            index: 0,
          }
        ]
      },
      {
        type: 'two',
        value: '2',
        index: 1,
      },
      {
        type: 'anonymous',
        nodes: [],
      },
      {
        type: 'two',
        value: '2',
        index: 2,
      }
    ]
  })
})

describe('one_plus', () => {
  const syntax = {
    lex: [
      ['one', /^1/],
      ['two', /^2/],
    ],
    parse: {
      main: ['sequence', [
        ['one_plus', 'one'],
        'two',
        ['one_plus', 'one'],
        'two',
      ]],
    },
  }

  test('when there is a match', () => {
    const source = '1112112'
    const tokens = lex({ source, syntax })
    const ast = parse({ tokens, source, syntax })

    expect(ast).toEqual({
      type: 'main',
      nodes: [
        {
          type: 'anonymous',
          nodes: [
            {
              type: 'one',
              value: '1',
              index: 0,
            },
            {
              type: 'one',
              value: '1',
              index: 1,
            },
            {
              type: 'one',
              value: '1',
              index: 2,
            },
          ]
        },
        {
          type: 'two',
          value: '2',
          index: 3,
        },
        {
          type: 'anonymous',
          nodes: [
            {
              type: 'one',
              value: '1',
              index: 4,
            },
            {
              type: 'one',
              value: '1',
              index: 5,
            },
          ],
        },
        {
          type: 'two',
          value: '2',
          index: 6,
        }
      ]
    })
  })

  test('when there is no match', () => {
    const source = '212'
    const tokens = lex({ source, syntax })

    expect(() => {
      parse({ tokens, source, syntax })
    }).toThrow(/Unexpected `two` "2". Expected `one`/)
  })

  test('when it is optional and there is no match', () => {
    const syntax = {
      lex: [
        ['one', /^1/],
        ['two', /^2/],
      ],
      parse: {
        main: ['optional', ['sequence', [
          ['one_plus', 'one'],
          'two',
          ['one_plus', 'one'],
          'two',
        ]]],
      },
    }
    const source = '212'
    const tokens = lex({ source, syntax })
    const ast = parse({ tokens, source, syntax })

    expect(ast).toEqual({
      type: 'main',
      node: null,
    })
  })
})
