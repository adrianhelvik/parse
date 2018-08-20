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

it('can have delimters for the many type', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z]+/],
      ['whitespace', /^[\s]+/],
      ['symbol', /^[,]/],
    ],
    parse: {
      main: ['many', 'word', 'symbol:,']
    }
  }

  const converted = convertSyntax(syntax)

  expect(converted).toEqual({
    type: 'main',
    ruleType: 'many',
    subRule: {
      type: 'word',
      ruleType: 'lex',
    },
    delimiter: {
      ruleType: 'lex',
      type: 'symbol',
      value: ',',
    }
  })
})

it('can convert VERIFIED sequence sub rules', () => {
  const syntax = {
    lex: [
      ['word', /^[a-zA-Z]+/],
      ['whitespace', /^[\s]+/],
      ['symbol', /^[,(){}]/],
    ],
    parse: {
      main: ['many', 'statement'],
      statement: ['either', [
        'function',
        'word',
      ]],
      function: ['sequence', [
        'word:fn',
        'VERIFIED',
        'symbol:{',
        'symbol:}',
      ]],
    }
  }

  const converted = convertSyntax(syntax)

  expect(converted).toEqual({
    type: 'main',
    ruleType: 'many',
    subRule: {
      type: 'statement',
      ruleType: 'either',
      subRule: [
        {
          type: 'function',
          ruleType: 'sequence',
          subRule: [
            { type: 'word', value: 'fn', ruleType: 'lex' },
            { type: 'symbol', value: '{', ruleType: 'lex', verified: true },
            { type: 'symbol', value: '}', ruleType: 'lex', verified: true },
          ]
        },
        { type: 'word', ruleType: 'lex' }
      ]
    }
  })
})
