import UnexpectedToken from './UnexpectedToken'

test('simple token', () => {
  const ctx = {
    tokens: [
      { type: 'word', value: 'foobar', index: 0 }
    ],
    rule: {
      ruleType: 'lex',
      type: 'word',
      value: 'foobie',
    },
    index: 0,
    source: 'foobar',
  }

  expect(UnexpectedToken(ctx).message).toMatch(/Unexpected `word` "foobar". Expected `word` "foobie"/)
})
