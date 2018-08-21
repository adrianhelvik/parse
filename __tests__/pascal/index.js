import syntax from '../../pascal/syntax'
import lex from '@adrianhelvik/lex'
import parse from '../../src'
import fs from 'fs'

it('can lex the syntax', () => {
  const source = fs.readFileSync(__dirname + '/../../pascal/primes.pas', 'utf-8')
  const tokens = lex({ source, syntax })

  // console.log(tokens)
})

xit('can parse the syntax', () => {
  const source = fs.readFileSync(__dirname + '/../../pascal/primes.pas', 'utf-8')
  const tokens = lex({ source, syntax })

  parse({ tokens, source, syntax })
})
