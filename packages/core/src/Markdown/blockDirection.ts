import type { MdNode } from './ast.js'
import { unicodeRegExp } from '../utils/unicodeRegExp.js'

// 带 Unicode 属性转义的正则要在运行时构造：源码构建可能改写正则字面量，
// 而 Next.js 自带的 Babel 没有所需的 Unicode 数据（见 unicodePropertyEscapes.test.ts）。

/**
 * 强从右到左的字符（Unicode 双向算法的 Bidi_Class `R` 和 `AL`）。现行文字按名字列出；
 * 两段范围覆盖补充多文种平面里的古代从右到左文字（含 Adlam）。
 */
const STRONG_RTL = unicodeRegExp(
  String.raw`[\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Mandaic}\p{Script=Nko}\p{Script=Samaritan}\p{Script=Syriac}\p{Script=Thaana}\u200F\u{10800}-\u{10FFF}\u{1E800}-\u{1EFFF}]`,
)

/** 阿拉伯文字里的弱字符：数字、数字前的符号、货币和百分号。扫描时跳过。 */
const WEAK_ARABIC_NUMBER = /[\u0600-\u0605\u0609\u060A\u0660-\u0669\u066A-\u066C\u06DD\u06F0-\u06F9\u0890\u0891\u08E2]/u

/** Bidi_Class `L`：其余所有字母、字母数字（`\p{Letter}` 不含）和从左到右标记。数字、标点、符号不在内。 */
const STRONG_LTR = unicodeRegExp(String.raw`[\p{Letter}\p{Nl}\u200E]`)

/** 组合符号跟随它的基字符的方向，所以扫描时跳过。 */
const COMBINING_MARK = unicodeRegExp(String.raw`\p{Mark}`)

/**
 * 双向算法 P2、P3 两条规则：第一个强方向字符的方向，没有就是 null。
 * 按码点读，代理对算一个字符。
 */
export function firstStrongDirection(text: string): 'ltr' | 'rtl' | null {
  for (const character of text) {
    if (COMBINING_MARK.test(character) || WEAK_ARABIC_NUMBER.test(character))
      continue
    if (STRONG_RTL.test(character))
      return 'rtl'
    if (STRONG_LTR.test(character))
      return 'ltr'
  }
  return null
}

/**
 * 不计入方向的节点：图片、代码块、公式、表格各按自己的规则读；
 * 扩展节点和引用显示的文字不在树里。
 */
const SKIPPED_TYPES = new Set([
  'image',
  'imageReference',
  'code',
  'math',
  'inlineMath',
  'table',
  'thematicBreak',
  'citation',
  'break',
  'extension',
])

function nodeDirection(node: MdNode): 'ltr' | 'rtl' | null {
  if (SKIPPED_TYPES.has(node.type))
    return null
  if (typeof node.value === 'string')
    return firstStrongDirection(node.value)
  for (const child of node.children ?? []) {
    const direction = nodeDirection(child)
    if (direction != null)
      return direction
  }
  return null
}

/**
 * 一块正文（段落、标题、引用、列表项、表格单元格）自己文字的方向；
 * 一个强方向字符都没有时返回 undefined，这一块沿用外面的方向。
 * 列表项和引用读它们下面的全部内容，嵌套列表也算在内。
 */
export function markdownBlockDirection(node: MdNode): 'ltr' | 'rtl' | undefined {
  return nodeDirection(node) ?? undefined
}
