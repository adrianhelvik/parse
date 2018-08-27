import parseZeroPlus from './parseZeroPlus'

it('can be delimited', () => {
  const rule = {
    ruleType: 'zero_plus',
    delimiter: {
      ruleType: 'lex',
      type: 'symbol',
      value: ',',
    },
    subRule: {
      ruleType: 'lex',
      type: 'word',
    }
  }
  const source = 'foo, bar, baz'
  const tokens = [
    {
      index: 0,
      type: 'word',
      value: 'foo',
    },
    {
      index: 3,
      type: 'symbol',
      value: ',',
    },
    {
      index: 5,
      type: 'word',
      value: 'bar',
    },
    {
      index: 8,
      type: 'symbol',
      value: ',',
    },
    {
      index: 10,
      type: 'word',
      value: 'baz',
    },
  ]
  const ctx = {
    optional: 0,
    index: 0,
    tokens,
    source,
    rule,
  }
  const ast = parseZeroPlus(ctx)

  expect(ast).toEqual({
    inc: 5,
    value: {
      nodes: [
        {
          index: 0,
          type: 'word',
          value: 'foo',
        },
        {
          index: 3,
          type: 'symbol',
          value: ',',
        },
        {
          index: 5,
          type: 'word',
          value: 'bar',
        },
        {
          index: 8,
          type: 'symbol',
          value: ',',
        },
        {
          index: 10,
          type: 'word',
          value: 'baz',
        },
      ]
    }
  })
})
