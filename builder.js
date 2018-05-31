const SENTENCE_START = '__start__'
const SENTENCE_END = '__end__'

const endOfSentence = (word) => /[.?!]/.test(word)
const strip = (word) => word.replace(/\W/, '')

const build = (text, wordlist) => {
  // first step is to split text into an array of lowercase words, stripped of punctuation
  const words = text.replace(/\n/g, ' ').split(' ').map(word => word.toLowerCase().trim())
  
  // we need to consider the first word of a sentence a child of SENTENCE_START
  // and the last word of a sentence the parent of SENTENCE_END
  let sentenceStart = false
  words.forEach((word, idx) => {
    if (!word) {
      return
    }
    // word is first word, add it to the sentence start children
    if (idx === 0 || sentenceStart) {
      if (wordlist[SENTENCE_START]) {
        // checking to see count
        if (wordlist[SENTENCE_START][word]) {
          wordlist[SENTENCE_START][word].count = wordlist[SENTENCE_START][word].count + 1
        } else {
          wordlist[SENTENCE_START][word] = { count: 1 }
        }
      } else {
        wordlist[SENTENCE_START] = { [word]: { count: 1 } }
      }
      sentenceStart = false
    }
    
    // word is last word in sentence, so we want to make our loop aware of that by setting the flag
    if (idx === words.length - 1 || endOfSentence(word)) {
      if (wordlist[SENTENCE_END]) {
        if (wordlist[SENTENCE_END][word]) {
          wordlist[SENTENCE_END][word].count = wordlist[SENTENCE_END][word].count + 1
        } else {
          wordlist[SENTENCE_END][word] = { count: 1 }
        }
      } else {
        wordlist[SENTENCE_END] = { [word]: { count: 1 } }
      }
      sentenceStart = true
    }
    
    if (!words[idx + 1]) {
      return
    }
    
    const nextWord = words[idx + 1] // strip(words[idx + 1])
    if (wordlist[word]) { // word is already in wordlist, so push
      if (wordlist[word][nextWord]) {
        wordlist[word][nextWord].count = wordlist[word][nextWord].count + 1
      } else {
        wordlist[word][nextWord] = { count: 1 }
      }
    } else {
      wordlist[word] = { [nextWord]: { count: 1 } }
    }
  })
  
  // loop through our wordlist and get a better weight for each nextWord
  // a word is { nextWord: { count: x }, nextWord2: { count: y } }
  Object.keys(wordlist).forEach((word) => {
    // sum all counts of nextWords
    let total = 0
    Object.keys(wordlist[word]).forEach((nextWord) => {
      total += wordlist[word][nextWord].count
    })
    
    Object.keys(wordlist[word]).forEach((nextWord) => {
      wordlist[word][nextWord].weight = wordlist[word][nextWord].count / total
    });
  })
}

const getNextWord = (currentWord, wordlist) => {
  const possibleNextWords = Object.keys(wordlist[currentWord])
  while (true) {
    const r = Math.random()
    const possibilities = []
    for (let i = 0; i < possibleNextWords.length; i++) {
      let word = wordlist[currentWord][possibleNextWords[i]]
      if (r < word.weight) {
        possibilities.push(possibleNextWords[i])
      }
    }
    if (possibilities.length) {
      return possibilities[Math.floor(Math.random() * possibilities.length)]
    }
  }
}

const generateSentence = (minLength, wordlist) => {
  // not sure how to use min length yet
  // first will just try to get it to spit something out
  const sentence = []
  
  let currentWord = SENTENCE_START
  while (true) {
    let nextWord = getNextWord(currentWord, wordlist)
    sentence.push(nextWord)
    currentWord = nextWord
    // see if we're at a possible end
    if (Object.keys(wordlist[SENTENCE_END]).includes(nextWord)) {
      if (sentence.length < minLength) {
        return generateSentence(minLength, wordlist)
      }
      break
    }
  }
  return sentence.join(' ')
}

module.exports = {
  build,
  generateSentence
}