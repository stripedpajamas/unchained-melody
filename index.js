#!/usr/bin/env node

const fs = require('fs')
const builder = require('./builder')

const words = fs.readFileSync(process.argv[2], 'utf8')
const wordlist = {}

console.log('Building wordlist...\n\n')
builder.build(words, wordlist)

console.log('Sentences:\n\n')
const howMany = parseInt(process.argv[3], 10) || 1
for (let i = 0; i < howMany; i++) {
  console.log('\t', builder.generateSentence(3, wordlist), '\n')
}
