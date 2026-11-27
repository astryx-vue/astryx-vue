import { cLike, defineCodeLanguage } from '../../grammar.js'

/** Java: `java`. */
export const java = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'java',
    identifiers: ['java'],
    fileExtensions: ['java'],
    fileNames: [],
  },
  () =>
    cLike(
      'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static super switch synchronized this throw throws transient try var void volatile while record sealed permits yield true false null',
      [
        { type: 'constant', regex: /@\w+/ },
        { type: 'string', regex: /"""[\s\S]*?"""/ },
      ],
    ),
)
