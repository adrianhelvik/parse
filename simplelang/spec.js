import lex from '@adrianhelvik/lex'
import parse from '../src/parse'
import syntax from './syntax'

const fixtures = `
add(1, 2)
print()
x = 0
let x = 10
i += 1
`

const _ = source => {
  const tokens = lex({ source, syntax })
  const ast = parse({ tokens, source, syntax })
  console.log(ast.nodes)
  return ast
}


fixtures
  .split('\n')
  .map(source => source.trim())
  .filter(x => x)
  .forEach(source => test(source, () => {
    _(source)
  }))
