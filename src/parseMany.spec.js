import parseMany from './parseMany'
import JSON from 'circular-json'

it('can parse many lex types', () => {
  const rule = {
    type: 'word',
    ruleType: 'lex',
  }

  const source = 'foo bar baz ...'

  const tokens = [
    { type: 'word', value: 'foo' },
    { type: 'word', value: 'bar' },
    { type: 'word', value: 'baz' },
    { type: 'nope', value: '...' },
  ]

  const { nodes, incrementIndex } = parseMany({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    { type: 'word', value: 'foo' },
    { type: 'word', value: 'bar' },
    { type: 'word', value: 'baz' },
  ])

  expect(incrementIndex).toBe(3)
})

it('can parse many sequence types', () => {
  const rule = {
    type: 'assignment',
    ruleType: 'sequence',
    subRule: [
      {
        type: 'ident',
        ruleType: 'lex',
      },
      {
        type: 'symbol',
        ruleType: 'lex',
        value: '=',
      },
      {
        type: 'ident',
        ruleType: 'lex',
      }
    ]
  }

  const source = 'foo = bar bar = baz'
  //              0   4 6   10  1416

  const tokens = [
    { type: 'ident', value: 'foo', index: 0 },
    { type: 'symbol', value: '=', index: 4 },
    { type: 'ident', value: 'bar', index: 6 },
    { type: 'ident', value: 'bar', index: 10 },
    { type: 'symbol', value: '=', index: 14 },
    { type: 'ident', value: 'baz', index: 16 },
  ]

  const { nodes, incrementIndex } = parseMany({
    shouldThrow: true,
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    { type: 'assignment', nodes: [
      { type: 'ident', value: 'foo', index: 0 },
      { type: 'symbol', value: '=', index: 4 },
      { type: 'ident', value: 'bar', index: 6 },
    ] },
    { type: 'assignment', nodes: [
      { type: 'ident', value: 'bar', index: 10 },
      { type: 'symbol', value: '=', index: 14 },
      { type: 'ident', value: 'baz', index: 16 },
    ] },
  ])

  expect(incrementIndex).toBe(6)
})

it('can parse many either types', () => {
  const rule = {
    type: 'keyword',
    ruleType: 'either',
    subRule: [
      {
        type: 'ident',
        ruleType: 'lex',
        value: 'import',
      },
      {
        type: 'ident',
        ruleType: 'lex',
        value: 'export',
      },
      {
        type: 'ident',
        ruleType: 'lex',
        value: 'with',
      }
    ]
  }

  const source = 'import export with export'

  const tokens = [
    { type: 'ident', value: 'import' },
    { type: 'ident', value: 'export' },
    { type: 'ident', value: 'with' },
    { type: 'ident', value: 'export' },
  ]

  const { nodes, incrementIndex } = parseMany({
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(nodes).toEqual([
    {
      type: 'keyword',
      node: { type: 'ident', value: 'import' },
    },
    {
      type: 'keyword',
      node: { type: 'ident', value: 'export' },
    },
    {
      type: 'keyword',
      node: { type: 'ident', value: 'with' },
    },
    {
      type: 'keyword',
      node: { type: 'ident', value: 'export' },
    },
  ])

  expect(incrementIndex).toBe(4)
})
