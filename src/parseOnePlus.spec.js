import parseOnePlus from './parseOnePlus'

test('pascal error from either inside one_plus', () => {
  /*
    parse: {
      main: [
        ['one_plus', ['either', [
          'func_decl',
          'proc_decl',
        ]]],
        'word:begin',
      ]
    }
  */

  const rule = {
    ruleType: 'either',
    type: 'fooOrBar',
    subRule: [
      {
        ruleType: 'lex',
        type: 'word',
        value: 'foo',
      },
      {
        ruleType: 'lex',
        type: 'word',
        value: 'bar',
      }
    ]
  }

  const source = 'foo bar NOPE'

  const tokens = [
    {
      type: 'word',
      value: 'foo',
      index: 0,
    },
    {
      type: 'word',
      value: 'bar',
      index: 4,
    },
    {
      type: 'word',
      value: 'NOPE',
      index: 9,
    }
  ]

  const { incrementIndex, nodes } = parseOnePlus({
    shouldThrow: true,
    index: 0,
    source,
    tokens,
    rule,
  })

  expect(incrementIndex).toBe(2)
  expect(nodes[0].type).toBe('fooOrBar')
  expect(nodes[0].node.value).toBe('foo')
  expect(nodes[1].type).toBe('fooOrBar')
  expect(nodes[1].node.value).toBe('bar')
  expect(nodes.length).toBe(2)
})
