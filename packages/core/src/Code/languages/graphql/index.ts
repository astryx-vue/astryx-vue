import { cLike, defineCodeLanguage, HASH_COMMENT } from '../../grammar.js'

/** GraphQL: `graphql`, `gql`. */
export const graphql = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'graphql',
    identifiers: ['graphql', 'gql'],
    fileExtensions: ['graphql', 'gql'],
    fileNames: [],
  },
  () =>
    cLike(
      'query mutation subscription fragment on type input enum interface union scalar schema extend directive implements repeatable true false null',
      [
        { type: 'variable', regex: /\$\w+/ },
        { type: 'constant', regex: /@\w+/ },
        { type: 'string', regex: /"""[\s\S]*?"""/ },
      ],
      [HASH_COMMENT],
    ),
)
