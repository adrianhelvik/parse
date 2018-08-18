import parseEither from './parseEither'

it('parses lex types', () => {
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
    { type: 'two', value: '2', index: 0 },
    { type: 'one', value: '1', index: 1 },
  ]

  const result = parseEither({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(result.node).toEqual({
    type: 'two',
    value: '2',
    index: 0,
  })

  expect(result.incrementIndex).toBe(1)
})

it('parses either types', () => {
  const source = '12'
  const rule = [
    {
      ruleType: 'either',
      type: 'oneOrTwo',
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
    { type: 'two', value: '2', index: 0 },
    { type: 'one', value: '1', index: 1 },
  ]

  const result = parseEither({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(result.node).toEqual({
    type: 'oneOrTwo',
    node: {
      type: 'two',
      value: '2',
      index: 0,
    }
  })

  expect(result.incrementIndex).toBe(1)
})

it('parses sequence types', () => {
  const source = '12'
  const rule = [
    {
      ruleType: 'sequence',
      type: 'oneOrTwo',
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

  const result = parseEither({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(result.node).toEqual({
    type: 'oneOrTwo',
    nodes: [
      {
        type: 'one',
        value: '1',
        index: 0,
      },
      {
        type: 'two',
        value: '2',
        index: 1,
      },
    ]
  })

  expect(result.incrementIndex).toBe(2)
})
