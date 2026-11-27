import { cLike, defineCodeLanguage, HASH_COMMENT } from '../../grammar.js'

/** Ruby: `ruby`, `rb`. */
export const ruby = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'ruby',
    identifiers: ['ruby', 'rb'],
    fileExtensions: ['rb', 'rake', 'gemspec'],
    fileNames: ['Gemfile', 'Rakefile'],
  },
  () =>
    cLike(
      'alias and begin break case class def defined do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield require attr_accessor',
      [
        { type: 'constant', regex: /:\w+/ },
        { type: 'variable', regex: /@{1,2}\w+|\$\w+/ },
      ],
      [HASH_COMMENT],
    ),
)
