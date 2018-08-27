import parseSequence from './parseSequence'
import parseRule from './parseRule'

describe('VERIFIED', () => {
  test('with verified', () => {
    const rule = {
      ruleType: 'either',
      type: 'statement',
      subRule: [
        {
          ruleType: 'sequence',
          type: 'variable declaration assignment',
          subRule: [
            {
              ruleType: 'lex',
              type: 'keyword',
              value: 'var',
            },
            {
              ruleType: 'lex',
              type: 'name',
            },
            {
              ruleType: 'lex',
              type: 'symbol',
              value: '=',
            },
            {
              ruleType: 'verified'
            },
            {
              ruleType: 'lex',
              type: 'name',
            },
          ]
        },
        {
          ruleType: 'sequence',
          type: 'variable declaration',
          subRule: [
            {
              ruleType: 'lex',
              type: 'keyword',
              value: 'var',
            },
            {
              ruleType: 'lex',
              type: 'name',
            },
          ]
        },
      ],
    }
    const source = 'var foo = _'
    const tokens = [
      {
        index: 0,
        value: 'var',
        type: 'keyword',
      },
      {
        index: 4,
        value: 'foo',
        type: 'name',
      },
      {
        index: 8,
        value: '=',
        type: 'symbol',
      },
      {
        index: 10,
        value: '_',
        type: 'symbol',
      }
    ]
    const ctx = {
      optional: 0,
      index: 0,
      tokens,
      source,
      rule,
    }
    expect(() => {
      parseRule(ctx)
    }).toThrow(/Expected name while parsing variable declaration assignment, but got symbol "_". Partial match: \[keyword "var", name "foo", symbol "="\]/)
  })

  test('without verified', () => {
    const rule = {
      ruleType: 'either',
      type: 'statement',
      subRule: [
        {
          ruleType: 'sequence',
          type: 'variable declaration assignment',
          subRule: [
            {
              ruleType: 'lex',
              type: 'keyword',
              value: 'var',
            },
            {
              ruleType: 'lex',
              type: 'name',
            },
            {
              ruleType: 'lex',
              type: 'symbol',
              value: '=',
            },
            {
              ruleType: 'lex',
              type: 'name',
            },
          ]
        },
        {
          ruleType: 'sequence',
          type: 'variable declaration',
          subRule: [
            {
              ruleType: 'lex',
              type: 'keyword',
              value: 'var',
            },
            {
              ruleType: 'lex',
              type: 'name',
            },
          ]
        },
      ],
    }
    const source = 'var foo = _'
    const tokens = [
      {
        index: 0,
        value: 'var',
        type: 'keyword',
      },
      {
        index: 4,
        value: 'foo',
        type: 'name',
      },
      {
        index: 8,
        value: '=',
        type: 'symbol',
      },
      {
        index: 10,
        value: '_',
        type: 'symbol',
      }
    ]
    const ctx = {
      optional: 0,
      index: 0,
      tokens,
      source,
      rule,
    }
    expect(() => {
      parseRule(ctx)
    }).not.toThrow()
  })
})
