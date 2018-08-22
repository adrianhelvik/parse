import lex from '@adrianhelvik/lex'
import parse from '../src/parse'
import syntax from './syntax'

const _ = ([source]) => {
  const tokens = lex({ source, syntax })
  const ast = parse({ tokens, source, syntax })
  return ast
}

it('can parse a simple program', () => {
  _`
    program Test;
    procedure foo;
    begin
    end
    .
  `
})
