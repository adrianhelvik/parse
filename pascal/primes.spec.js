// import convertSyntax from '@adrianhelvik/convert-syntax'
import lex from '@adrianhelvik/lex'
import syntax from './syntax'
import parse from '../src'
import fs from 'fs'

const source = fs.readFileSync(__dirname + '/primes.pas', 'utf-8')

it('can parse the source', () => {
  const tokens = lex({ source, syntax })
  // const rule = convertSyntax(syntax)
  const ast = parse({ tokens, source, syntax })

  console.log(ast)
})
