'use strict';

var _lex = require('@adrianhelvik/lex');

var _lex2 = _interopRequireDefault(_lex);

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('can parse one rules and lex rules', function () {
  var syntax = {
    lex: [['word', /^[a-zA-Z]+/]],
    parse: {
      main: ['one', 'word']
    }
  };
  var source = 'foo';
  var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
  var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

  expect(ast).toEqual({
    type: 'main',
    node: {
      type: 'word',
      value: 'foo',
      index: 0
    }
  });
});

it('can parse either rules', function () {
  var syntax = {
    lex: [['one', /^1/], ['two', /^2/]],
    parse: {
      main: ['either', ['one', 'two']]
    }
  };
  var source = '2';
  var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
  var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

  expect(ast).toEqual({
    type: 'main',
    node: {
      type: 'two',
      value: '2',
      index: 0
    }
  });
});

describe('optional rules', function () {
  var syntax = {
    lex: [['one', /^1/], ['two', /^2/]],
    parse: {
      main: ['sequence', [['optional', 'one'], 'two']]
    }
  };

  test('with optional', function () {
    var source = '12';
    var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
    var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

    expect(ast).toEqual({
      type: 'main',
      nodes: [{
        type: 'anonymous',
        node: {
          type: 'one',
          value: '1',
          index: 0
        }
      }, {
        type: 'two',
        value: '2',
        index: 1
      }]
    });
  });

  test('without optional', function () {
    var source = '2';
    var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
    var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

    expect(ast).toEqual({
      type: 'main',
      nodes: [{
        type: 'anonymous',
        node: null
      }, {
        type: 'two',
        value: '2',
        index: 0
      }]
    });
  });
});

it('can parse zero_plus rules', function () {
  var syntax = {
    lex: [['one', /^1/], ['two', /^2/]],
    parse: {
      main: ['sequence', [['zero_plus', 'one'], 'two', ['zero_plus', 'one'], 'two']]
    }
  };
  var source = '122';
  var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
  var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

  expect(ast).toEqual({
    type: 'main',
    nodes: [{
      type: 'anonymous',
      nodes: [{
        type: 'one',
        value: '1',
        index: 0
      }]
    }, {
      type: 'two',
      value: '2',
      index: 1
    }, {
      type: 'anonymous',
      nodes: []
    }, {
      type: 'two',
      value: '2',
      index: 2
    }]
  });
});

describe('one_plus', function () {
  var syntax = {
    lex: [['one', /^1/], ['two', /^2/]],
    parse: {
      main: ['sequence', [['one_plus', 'one'], 'two', ['one_plus', 'one'], 'two']]
    }
  };

  test('when there is a match', function () {
    var source = '1112112';
    var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
    var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

    expect(ast).toEqual({
      type: 'main',
      nodes: [{
        type: 'anonymous',
        nodes: [{
          type: 'one',
          value: '1',
          index: 0
        }, {
          type: 'one',
          value: '1',
          index: 1
        }, {
          type: 'one',
          value: '1',
          index: 2
        }]
      }, {
        type: 'two',
        value: '2',
        index: 3
      }, {
        type: 'anonymous',
        nodes: [{
          type: 'one',
          value: '1',
          index: 4
        }, {
          type: 'one',
          value: '1',
          index: 5
        }]
      }, {
        type: 'two',
        value: '2',
        index: 6
      }]
    });
  });

  test('when there is no match', function () {
    var source = '212';
    var tokens = (0, _lex2.default)({ source: source, syntax: syntax });

    expect(function () {
      (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });
    }).toThrow(/Expected.+one or more one/);
  });

  test('when it is optional and there is no match', function () {
    var syntax = {
      lex: [['one', /^1/], ['two', /^2/]],
      parse: {
        main: ['optional', ['sequence', [['one_plus', 'one'], 'two', ['one_plus', 'one'], 'two']]]
      }
    };
    var source = '212';
    var tokens = (0, _lex2.default)({ source: source, syntax: syntax });
    var ast = (0, _2.default)({ tokens: tokens, source: source, syntax: syntax });

    expect(ast).toEqual({
      type: 'main',
      node: null
    });
  });
});