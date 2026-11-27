import { cLike, CPP_WORDS, defineCodeLanguage, DIRECTIVE } from '../../grammar.js'

/** Objective-C: `objective-c`, `objc`, `m`, `mm`. */
export const objectiveC = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'objective-c',
    identifiers: ['objective-c', 'objc', 'm', 'mm'],
    fileExtensions: ['m', 'mm'],
    fileNames: [],
  },
  () =>
    cLike(`${CPP_WORDS} id self super nil Nil YES NO SEL BOOL instancetype`, [
      { type: 'keyword', regex: DIRECTIVE },
      { type: 'string', regex: /@"(?:[^"\\\n]|\\.)*"/ },
      { type: 'keyword', regex: /@\w+/ },
    ]),
)
