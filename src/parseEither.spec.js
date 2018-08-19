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

it('returns null if there are no tokens left', () => {
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

  const result = parseEither({
    index: 2,
    source,
    tokens,
    rule,
  })

  expect(result).toBe(null)
})

it('throws if shouldThrow is true and it is outside of the token range', () => {
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

  expect(() => {
    parseEither({
      shouldThrow: true,
      index: 2,
      source,
      tokens,
      rule,
    })
  }).toThrow(/Expected either one or two, but reached the end of the source/)
})

it('throws if shouldThrow is true and no match was found', () => {
  const source = '12'
  const rule = [
    {
      ruleType: 'lex',
      type: 'three',
    },
  ]
  const tokens = [
    { type: 'one', value: '1', index: 0 },
    { type: 'two', value: '2', index: 1 },
  ]

  expect(() => {
    parseEither({
      shouldThrow: true,
      index: 0,
      source,
      tokens,
      rule,
      type: 'foobar',
    })
  }).toThrow(/Expected three while parsing foobar. Got one./)
})
