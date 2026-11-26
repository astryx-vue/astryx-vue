/**
 * 对应原版 Astryx 的 `utils/typeaheadMatch`：所有「敲字母跳到某一项」的路径共用的比对规则。
 *
 * 跳转是导航不是排序，所以在任何语言下都按同一套规则折叠：
 * 不分大小写；去掉规范分解后留下的组合附加符号（U+0300–U+036F）；
 * 六个带横线的拉丁字母和土耳其语的 ı 当作对应的普通字母。
 * 敲进来的字母本身带这些符号时，优先找完全对得上的那一项，大小写按土耳其语配对（ı 配 I，İ 配 i）。
 */

const COMBINING_MARKS = /[\u0300-\u036F]/g

// 折叠时去掉横线的六个字母（大小写都有），再加上土耳其语无点的 ı。带点的 İ 会分解成 I 加 U+0307，不用单列。
const STROKED: Readonly<Record<string, string>> = {
  đ: 'd',
  Đ: 'd',
  ł: 'l',
  Ł: 'l',
  ø: 'o',
  Ø: 'o',
  ħ: 'h',
  Ħ: 'h',
  ŧ: 't',
  Ŧ: 't',
  ƀ: 'b',
  Ƀ: 'b',
  ı: 'i',
}
const STROKED_CHARS = /[đłøħŧƀı]/gi
const MARKED_CHARS = /[đłøħŧƀıİ]/i

/** 按跳转规则折叠一段文字：不分大小写、去掉组合附加符号、带横线的字母和 ı 变成普通字母。和语言无关。 */
export function foldForTypeahead(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(STROKED_CHARS, char => STROKED[char] ?? char)
    // 折叠保留下来的符号（日文浊点、阿拉伯文 hamza、韩文收音）重新合成，免得一个字的前缀对不上。
    .normalize('NFC')
    .toLowerCase()
}

/**
 * 再敲一个键之后的缓冲。所有路径都用它，缓冲的方式才一致。
 * 第一个键是单独的组合附加符号时返回 null：它不是能跳过去的字母。
 * 反复敲同一个字母（按折叠后比）是在匹配项之间循环，缓冲保持那一个字母，不往长里加。
 */
export function nextTypeaheadBuffer(buffer: string, key: string): string | null {
  if (buffer.length === 0 && key !== ' ' && foldForTypeahead(key).length === 0)
    return null
  const isRepeatSameChar = buffer.length > 0
    && [...buffer].every(char => foldForTypeahead(char) === foldForTypeahead(key))
  return isRepeatSameChar ? key : buffer + key
}

/** 完全匹配用的大小写折叠，按土耳其语配对：I 配 ı，İ 配 i。先合成，单独敲的附加符号和合成好的标签一样算一个字母。 */
function exactFold(text: string): string {
  return text
    .normalize('NFC')
    .replace(/I/g, 'ı')
    .replace(/İ/g, 'i')
    .toLowerCase()
}

/** 敲进来的字母带不带「值得优先完全匹配」的符号。 */
function hasMark(typed: string): boolean {
  return MARKED_CHARS.test(typed) || /[\u0300-\u036F]/.test(typed.normalize('NFD'))
}

/** `label` 是否以 `typed` 开头（按折叠后比）。`exact` 时还要求没折叠的字母也对得上。 */
export function typeaheadPrefixMatch(label: string, typed: string, exact = false): boolean {
  const trimmed = label.trim()
  if (exact)
    return exactFold(trimmed).startsWith(exactFold(typed))
  const foldedTyped = foldForTypeahead(typed)
  // 单独一个组合附加符号折叠后什么都没有，不是能跳过去的字母。
  if (foldedTyped.length === 0)
    return false
  return foldForTypeahead(trimmed).startsWith(foldedTyped)
}

/**
 * 按 `order` 的顺序找下一个标签对得上的项，返回下标，找不到返回 -1。
 * 敲进来的字母带附加符号、带横线的字母、ı 或 İ 时，顺序里任何一处完全匹配都优先于折叠后的匹配。
 */
export function findTypeaheadMatch(
  order: ReadonlyArray<number>,
  getLabel: (index: number) => string | null | undefined,
  typed: string,
): number {
  const passes = hasMark(typed) ? [true, false] : [false]
  for (const exact of passes) {
    for (const index of order) {
      const label = getLabel(index)
      if (label != null && typeaheadPrefixMatch(label, typed, exact))
        return index
    }
  }
  return -1
}

/** 按键事件上的修饰键状态。 */
interface ModifierKeyEvent {
  readonly ctrlKey: boolean
  readonly metaKey: boolean
  getModifierState?: (key: string) => boolean
}

/**
 * 这一下是不是 Control 或 Command 快捷键，而不是敲出来的字。
 * Windows 上的 AltGr 也会报 Control，同时带 AltGraph 修饰键；它敲出来的是字母（例如 ł）。
 */
export function isShortcutChord(event: ModifierKeyEvent): boolean {
  if (event.metaKey)
    return true
  return event.ctrlKey && event.getModifierState?.('AltGraph') !== true
}
