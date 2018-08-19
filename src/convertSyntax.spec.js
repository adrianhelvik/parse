import convertSyntax from './convertSyntax'

it('converts lex types', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z]+/],
      ['whitespace', /^[\s]+/],
    ],
    parse: {
      main: ['sequence', [
        'word',
        'whitespace',
      ]]
    }
  }

  expect(convertSyntax(syntax)).toEqual({
    type: 'main',
    ruleType: 'sequence',
    subRule: [
      {
        type: 'word',
        ruleType: 'lex',
      },
      {
        type: 'whitespace',
        ruleType: 'lex',
      }
    ]
  })
})

it('converts key:value types', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z]+/],
      ['whitespace', /^[\s]+/, 'ignore'],
    ],
    parse: {
      main: ['sequence', [
        'word:hello',
        'word:world',
      ]]
    }
  }

  expect(convertSyntax(syntax)).toEqual({
    type: 'main',
    ruleType: 'sequence',
    subRule: [
      {
        type: 'word',
        value: 'hello',
        ruleType: 'lex',
      },
      {
        type: 'word',
        value: 'world',
        ruleType: 'lex',
      }
    ]
  })
})

it('converts the many type', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z]+/],
      ['whitespace', /^[\s]+/],
    ],
    parse: {
      main: ['many', 'word'],
    }
  }

  expect(convertSyntax(syntax)).toEqual({
    type: 'main',
    ruleType: 'many',
    subRule: {
      type: 'word',
      ruleType: 'lex',
    },
  })
})

describe('from ergolang', () => {
  it('should catch this wrong usage', () => {
    const syntax = {
      lex: [
        ['string', /^'((\\')|[^'])+'/],
        ['whitespace', /^\s+/, 'ignore'],
        ['keyword', /^(let)/],
        ['ident', /^[a-zA-Z][a-zA-Z0-9]*/],
        ['double', /^([1-9][0-9]*)?\.[0-9]+/],
        ['integer', /^[1-9][0-9]*/],
        ['symbol', /^[=\[\],()]/],
      ],
      parse: {
        main: ['many', [
          'statement',
        ]],
        statement: ['either', [
          'funcCall',
          'varDecl',
        ]],
        funcCall: ['sequence', [
          'ident',
          'expression',
        ]],
        expression: ['either', [
          'ident',
        ]],
      }
    }

    expect(() => {
      convertSyntax(syntax)
    }).toThrow(/many/)
  })
})
