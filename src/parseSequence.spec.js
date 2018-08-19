import parseSequence from './parseSequence'

it('parses a sequence of lex types', () => {
  const source = '12'
  const rule = [
    {
      ruleType: 'lex',
      type: 'one',
    },
    {
      ruleType: 'lex',
      type: 'two',
    }
  ]
  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
  ]

  const { nodes, incrementIndex } = parseSequence({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
  ])

  expect(incrementIndex).toBe(2)
})

it('parses a sequence including a sequence type', () => {
  const source = '12'
  const rule = [
    {
      type: 'onetwo',
      ruleType: 'sequence',
      subRule: [
        {
          ruleType: 'lex',
          type: 'one',
        },
        {
          ruleType: 'lex',
          type: 'two',
        }
      ]
    }
  ]

  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
  ]

  const { nodes, incrementIndex } = parseSequence({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    { type: 'onetwo', nodes: [
      { type: 'one', value: '1', index: 0 },
      { type: 'two', value: '2', index: 1 },
    ] }
  ])

  expect(incrementIndex).toBe(2)
})

it('parses a sequence including an either type', () => {
  const source = '12'
  const rule = [
    {
      type: 'oneOrTwo',
      ruleType: 'either',
      subRule: [
        {
          ruleType: 'lex',
          type: 'one',
        },
        {
          ruleType: 'lex',
          type: 'two',
        }
      ]
    }
  ]

  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
  ]

  const { nodes, incrementIndex } = parseSequence({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    {
      type: 'oneOrTwo', node: {
        type: 'one',
        value: '1',
        index: 0,
      }
    }
  ])

  expect(incrementIndex).toBe(1)
})

it('can specify an optional rule', () => {
  const source = '13'
  const rule = [
    {
      ruleType: 'lex',
      type: 'one',
    },
    {
      ruleType: 'lex',
      type: 'two',
      optional: true,
    },
    {
      ruleType: 'lex',
      type: 'three',
    },
  ]

  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'three', value: '3', index: 1 },
  ]

  const { nodes, incrementIndex } = parseSequence({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    { type: 'one', value: '1', index: 0 },
    { type: 'three', value: '3', index: 1 },
  ])

  expect(incrementIndex).toBe(2)
})

it('throws when you are outside the token range', () => {
  const source = '123'
  const rule = [
    { ruleType: 'lex', type: 'notHere' },
  ]
  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
    { type: 'three', value: '3', index: 2 },
  ]

  expect(() => parseSequence({
    shouldThrow: true,
    index: 3,
    source,
    tokens,
    rule,
  })).toThrow('Expected notHere, but reached the end of the source.')
})

it('throws when shouldThrow is true and no match was found', () => {
  const source = '123'
  const rule = [
    { ruleType: 'lex', type: 'notHere' },
  ]
  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
    { type: 'three', value: '3', index: 2 },
  ]

  expect(() => parseSequence({
    shouldThrow: true,
    index: 0,
    source,
    tokens,
    rule,
    type: 'foobar',
  })).toThrow('Expected notHere, but got one while parsing foobar.')
})

it('handles many rules', () => {
  const rule = [
    {
      ruleType: 'many',
      type: 'wordList',
      delimiter: {
        ruleType: 'lex',
        type: 'symbol',
        value: ',',
      },
      subRule: {
        type: 'word',
        ruleType: 'lex',
      }
    }
  ]

  const source = 'foo, bar, baz'

  const tokens = [
    { type: 'word', value: 'foo', index: 0 },
    { type: 'symbol', value: ',', index: 3 },
    { type: 'word', value: 'bar', index: 5 },
    { type: 'symbol', value: ',', index: 8 },
    { type: 'word', value: 'baz', index: 10 },
  ]

  expect(parseSequence({
    shouldThrow: true,
    index: 0,
    tokens,
    source,
    rule,
  })).toEqual({
    incrementIndex: 5,
    nodes: [
      {
        type: 'wordList',
        nodes: [
          { type: 'word', value: 'foo', index: 0 },
          { type: 'symbol', value: ',', index: 3 },
          { type: 'word', value: 'bar', index: 5 },
          { type: 'symbol', value: ',', index: 8 },
          { type: 'word', value: 'baz', index: 10 },
        ]
      }
    ]
  })
})
