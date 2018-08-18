# @adrianhelvik/syntax

## Installation

```sh
npm i --save @adrianhelvik/syntax
yarn add @adrianhelvik/syntax
```

## Usage

```javascript
const syntax = {
  lex: [
    ['whitespace', /^\s+/, 'ignore'],
    ['keyword', /^(let)/],
    ['symbol', /^[()=]/],
    ['ident', /^[a-zA-Z][a-zA-Z0-9]*/],
    ['number', /^[0-9]+/],
  ],
  parse: {
    main: ['either', 'many', [
      'assignment',
      'funcCall',
      'varDecl',
    ]],
    funcCall: ['sequence', [
      'ident',
      'symbol:(',
      'symbol:)',
    ]],
    assignment: ['sequence', [
      'keyword:let',
      'symbol:=',
      'expression',
    ]],
    expression: ['either', [
      'number',
      'ident',
    ]]
  }
}
const source = `
let i = 0

while (i < 10)
  i = increment(i)

console.log(i)
`

```
