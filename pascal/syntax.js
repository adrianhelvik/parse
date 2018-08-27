export default {
  lex: [
    ['comment', /^\/\*(.|[\s\n])+?\*\//m, 'ignore'],
    ['comment', /^{.+}/m, 'ignore'],
    ['keyword', /^(procedure|function|program|begin|end|const|var|array|of|if|then|else|while|do|or|div|mod|and|not)(?![a-zA-Z0-9])/],
    ['name', /^[a-zA-Z][a-zA-Z0-9]*/],
    ['numeric_literal', /^[0-9]+/],
    ['char_literal', /^'(('')|[^'])+'/],
    ['char_literal', /^’((’’)|[^’])+’/],
    ['whitespace', /^[\s]+/m, 'ignore'],
    ['symbol', /^(<=|>=|\.\.|:=|[.+;=:[\]*()<>])/],
  ],
  parse: {

    // 2.2

    main: ['sequence', [
      'keyword:program',
      'name',
      'symbol:;',
      'block',
      'symbol:.',
    ]],

    // 2.2.1

    block: ['sequence', [
      ['optional', 'const_decl_part'],
      ['optional', 'var_decl_part'],
      ['zero_plus', ['either', [ // Changed from one_plus to zero_plus
        'func_decl',
        'proc_decl',
      ]]],
      'keyword:begin',
      'VERIFIED',
      'stmt_list',
      'keyword:end',
    ]],

    // 2.2.1.1

    const_decl_part: ['sequence', [
      'keyword:const',
      'VERIFIED',
      ['one_plus', 'const_decl'],
    ]],
    const_decl: ['sequence', [
      'name',
      'symbol:=',
      'VERIFIED',
      'constant',
      'symbol:;',
    ]],
    constant: ['sequence', [
      ['optional', 'prefix_opr'],
      'unsigned_constant',
    ]],
    unsigned_constant: ['either', [
      'name',
      'numeric_literal',
      'char_literal',
    ]],
    prefix_opr: ['either', [
      'symbol:+',
      'symbol:-',
    ]],
    var_decl_part: ['sequence', [
      'keyword:var',
      'VERIFIED',
      ['one_plus', 'var_decl'],
    ]],
    var_decl: ['sequence', [
      'name',
      'symbol::',
      'VERIFIED',
      'type',
      'symbol:;',
    ]],
    type_name: ['one', 'name'],
    array_type: ['sequence', [
      'keyword:array',
      'VERIFIED',
      'symbol:[',
      'constant',
      'symbol:..',
      'constant',
      'symbol:]',
      'keyword:of',
      'type',
    ]],

    // 2.2.1.3

    func_decl: ['sequence', [
      'keyword:function',
      'name',
      ['optional', 'param_decl_list'],
      'symbol::',
      'type_name',
      'symbol:;',
      'block',
      'symbol:;',
    ]],
    proc_decl: ['sequence', [
      'keyword:procedure',
      'VERIFIED',
      'name',
      ['optional', 'param_decl_list'],
      'symbol:;',
      'block',
      'symbol:;',
    ]],

    // 2.2.2

    param_decl_list: ['sequence', [
      'symbol:(',
      ['one_plus', 'param_decl', 'symbol:;'],
      'symbol:)',
    ]],
    param_decl: ['sequence', [
      'name',
      'symbol::',
      'type_name',
    ]],
    stmt_list: ['zero_plus', 'statement', 'symbol:;'],
    statement: ['either', [
      'assign_stmt',
      'compound_stmt',
      'empty_stmt',
      'if_stmt',
      'proc_call',
      'while_stmt',
    ]],

    // 2.2.2.1

    empty_stmt: ['one', 'symbol:;'],

    // 2.2.2.2

    assign_stmt: ['sequence', [
      'variable',
      'symbol::=',
      'VERIFIED',
      'expression',
    ]],
    variable: ['sequence', [
      'name',
      ['optional', ['sequence', [
        'symbol:[',
        'expression',
        'symbol:]',
      ]]],
    ]],
    proc_call: ['sequence', [
      'name',
      ['optional', ['sequence', [
        'symbol:(',
        ['one_plus', 'expression', 'symbol:,'],
        'symbol:)',
      ]]],
    ]],

    // 2.2.2.4

    if_stmt: ['sequence', [
      'keyword:if',
      'expression',
      'keyword:then',
      'statement',
      ['optional', ['sequence', [
        'keyword:else',
        'statement',
      ]]],
    ]],

    // 2.2.2.5

    while_stmt: ['sequence', [
      'keyword:while',
      'expression',
      'keyword:do',
      'statement',
    ]],

    // 2.2.2.6

    compound_stmt: ['sequence', [
      'keyword:begin',
      'VERIFIED',
      'stmt_list',
      'keyword:end',
    ]],

    // 2.2.3

    expression: ['sequence', [
      'simple_expr',
      'rel_opr',
      'simple_expr',
    ]],
    rel_opr: ['either', [
      'symbol:=',
      'symbol:<>',
      'symbol:<',
      'symbol:<=',
      'symbol:>',
      'symbol:>=',
    ]],
    simple_expr: ['sequence', [
      ['optional', 'prefix_opr'],
      ['one_plus', 'term_opr', 'term'],
    ]],
    term_opr: ['either', [
      'symbol:+',
      'symbol:-',
      'keyword:or',
    ]],
    term: ['one_plus', 'factor', 'factor_opr'],

    // 2.2.4

    factor_opr: ['either', [
      'symbol:*',
      'keyword:div',
      'keyword:mod',
      'keyword:and',
    ]],
    factor: ['either', [
      'unsigned_constant',
      'variable',
      'func_call',
      'inner_expr',
      'negation',
    ]],
    func_call: ['sequence', [
      'name',
      ['optional', ['sequence', [
        'symbol:(',
        ['one_plus', 'expression', 'symbol:,'],
        'symbol:)',
      ]]],
    ]],
    inner_expr: ['sequence', [
      'symbol:(',
      'expression',
      'symbol:)',
    ]],
    negation: ['sequence', [
      'keyword:not',
      'factor',
    ]],
    type: ['either', [
      'array_type',
      'name',
    ]],
  }
}
