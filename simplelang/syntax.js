export default {
  lex: [
    ['whitepace', /^[\s]+/, 'ignore'],
    ['numeric_literal', /^[0-9]+/],
    ['word', /^[a-zA-Z]+/],
    ['symbol', /^((\+=)|[+(),=])/],
  ],
  parse: {
    main: ['one', 'statement_list'],
    statement_list: ['zero_plus', 'statement', ';'],
    statement: ['either', [
      'function_invocation',
      'var_decl',
      'expression',
    ]],
    function_invocation: ['sequence', [
      'word',
      'symbol:(',
      ['many', 'expression', 'symbol:,'],
      'symbol:)',
    ]],
    var_decl: ['sequence', [
      'word:let',
      'assignment',
    ]],
    assignment: ['sequence', [
      'word',
      'symbol:=',
      'expression',
    ]],
    increment: ['sequence', [
      'word',
      'symbol:+=',
      'expression',
    ]],
    expression: ['either', [
      'assignment',
      'numeric_literal',
      'word',
      'increment',
    ]],
  }
}
