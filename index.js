const fs = require('fs')
const builder = require('./builder')

const words = fs.readFileSync(process.argv[2], 'utf8')
const wordlist = {}

console.log('Building wordlist...\n\n')
builder.build(words, wordlist)

const howMany = parseInt(process.argv[3], 10) || 1
for (let i = 0; i < howMany; i++) {
  console.log(builder.generateSentence(3, wordlist), '\n')
}
