import { cLike, defineCodeLanguage } from '../../grammar.js'

/** Lua: `lua`. */
export const lua = /* @__PURE__ */ defineCodeLanguage(
  { name: 'lua', identifiers: ['lua'], fileExtensions: ['lua'], fileNames: [] },
  () =>
    cLike(
      'and break do else elseif end false for function goto if in local nil not or repeat return then true until while',
      [{ type: 'string', regex: /\[(=*)\[[\s\S]*?\]\1\]/ }],
      [/--\[(=*)\[[\s\S]*?\]\1\]/, /--[^\n]*/],
    ),
)
