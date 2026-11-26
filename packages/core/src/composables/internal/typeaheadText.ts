/**
 * 类型跳转（type-to-select）用的文字折叠：忽略大小写、组合符号（U+0300–U+036F）、
 * 带斜杠的字母（đ ł ø ħ ŧ ƀ）以及土耳其语带点和不带点的 i。
 * 类型跳转是导航不是排序，所以所有语言都按同一套规则。
 */
const STROKED_LETTERS: Record<string, string> = {
  đ: 'd',
  ł: 'l',
  ø: 'o',
  ħ: 'h',
  ŧ: 't',
  ƀ: 'b',
  ı: 'i',
}

export function foldTypeaheadText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[đłøħŧƀı]/g, char => STROKED_LETTERS[char] ?? char)
}

/** `label` 折叠之后是否以折叠后的 `prefix` 开头。 */
export function startsWithTypeahead(label: string, prefix: string): boolean {
  return foldTypeaheadText(label).startsWith(prefix)
}
