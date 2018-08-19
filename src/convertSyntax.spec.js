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
