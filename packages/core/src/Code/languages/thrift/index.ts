import {
  BLOCK_COMMENT,
  cLike,
  defineCodeLanguage,
  HASH_COMMENT,
  LINE_COMMENT,
} from '../../grammar.js'

/** Thrift IDL: `thrift`. */
export const thrift = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'thrift',
    identifiers: ['thrift'],
    fileExtensions: ['thrift'],
    fileNames: [],
  },
  () =>
    cLike(
      'namespace include cpp_include typedef enum struct union exception service extends oneway void throws const required optional bool byte i8 i16 i32 i64 double string binary list set map true false',
      [],
      [BLOCK_COMMENT, LINE_COMMENT, HASH_COMMENT],
    ),
)
