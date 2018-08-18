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
