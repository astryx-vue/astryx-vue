import type { MdNode } from './ast.js'
import { unicodeRegExp } from '../utils/unicodeRegExp.js'

// 带 Unicode 属性转义的正则要在运行时构造：源码构建可能改写正则字面量，
// 而 Next.js 自带的 Babel 没有所需的 Unicode 数据（见 unicodePropertyEscapes.test.ts）。

/**
 * 强从右到左的字符（Unicode 双向算法的 Bidi_Class `R` 和 `AL`）。现行文字按名字列出；
 * 两段范围覆盖补充多文种平面里的古代从右到左文字。
 *
 * JavaScript 没有 `\p{Bidi_Class=…}`，这里按文字和类别近似，并把需要的几处写出来：
 * 分号、问号、阿拉伯字母标记和 tatweel 的文字属性是 Common，但 Bidi_Class 是 `AL`；
 * tatweel 同时是修饰字母，不写出来的话以它开头的阿拉伯词会被读成从左到右。
 */
const STRONG_RTL = unicodeRegExp(
  String.raw`[\p{Script=Adlam}\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Mandaic}\p{Script=Nko}\p{Script=Samaritan}\p{Script=Syriac}\p{Script=Thaana}\u061B\u061C\u061F\u0640\u200F\u{10800}-\u{10FFF}\u{1E800}-\u{1EFFF}]`,
)

/**
 * 扫描时跳过的字符：Bidi_Class `AN`、`EN`、`ET`、`ON`，它们定不了方向。
 * 一部分是阿拉伯文字自己的数字、数字前的符号、货币和百分号；一部分是处处都弱的数字
 * （ASCII、全角、数学用的是 `EN`）；其余落在上面两段补充平面范围里，那两段按整个平面划，
 * 连这些文字的数字和标点也圈了进去：腓尼基词分隔符、阿维斯陀标点、哈乃斐罗兴亚、加雷、
 * 耶兹迪和鲁米数字、一个加雷符号、阿拉伯数学运算符。
 * 是否属于这里只看 Bidi_Class，不看像不像数字：印度和奥斯曼 Siyaq 数字是 `AL`，N'Ko 和
 * Adlam 的数字是 `R`，都仍然是强的。
 */
const WEAK_NUMBER_OR_NEUTRAL = /[0-9\u0600-\u0605\u0609\u060A\u0660-\u0669\u066A-\u066C\u06DD\u06F0-\u06F9\u0890\u0891\u08E2\uFF10-\uFF19\u{1091F}\u{10B39}-\u{10B3F}\u{10D30}-\u{10D39}\u{10D40}-\u{10D49}\u{10D6E}\u{10E60}-\u{10E7E}\u{10ED0}-\u{10ED8}\u{1CCF0}-\u{1CCF9}\u{1D7CE}-\u{1D7FF}\u{1EEF0}\u{1EEF1}\u{1FBF0}-\u{1FBF9}]/u

/**
 * Bidi_Class `L`：其余所有字母、字母数字（`\p{Letter}` 不含）、从左到右标记和十进制数字。
 * 多数文字的数字是 `L`（天城文、孟加拉文、泰米尔文、泰文……），所以以它们开头的行读作从左到右；
 * 不是 `L` 的数字在上面已先跳过。标点和符号不在内。
 */
const STRONG_LTR = unicodeRegExp(String.raw`[\p{Letter}\p{Nl}\p{Nd}\u200E]`)

/** 组合符号跟随它的基字符的方向，所以扫描时跳过。 */
const COMBINING_MARK = unicodeRegExp(String.raw`\p{Mark}`)

/**
 * 按文字和类别近似双向算法的 P2、P3：第一个强方向字符的方向，没有就是 null。
 * 不跳过隔离段。按码点读，代理对算一个字符。
 */
export function firstStrongDirection(text: string): 'ltr' | 'rtl' | null {
  for (const character of text) {
    if (COMBINING_MARK.test(character) || WEAK_NUMBER_OR_NEUTRAL.test(character))
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

/** 外层 `InternationalizationProvider` 的方向，以及包着这一块的那一块的方向。 */
export interface BlockDirectionScope {
  readonly provider: 'ltr' | 'rtl'
  readonly around: 'ltr' | 'rtl'
}

/**
 * 一块正文或一个表格单元格的 `dir`。自己没有强方向字符时取 provider 的方向，
 * 而且只在外面那一块读向相反时才写出来；其余情况继承到的本来就是这个方向。
 */
export function blockDirection(node: MdNode, scope: BlockDirectionScope | undefined): 'ltr' | 'rtl' | undefined {
  const own = markdownBlockDirection(node)
  if (own != null)
    return own
  return scope != null && scope.around !== scope.provider ? scope.provider : undefined
}

/** 引用或列表项里面那些块用的范围：外面那一块的方向换成这一块自己的。 */
export function innerDirectionScope(node: MdNode, scope: BlockDirectionScope | undefined): BlockDirectionScope | undefined {
  if (scope == null)
    return undefined
  return { provider: scope.provider, around: markdownBlockDirection(node) ?? scope.provider }
}

/** 这一块的方向和外面那一块相反。 */
export function readsAgainst(direction: 'ltr' | 'rtl' | undefined, scope: BlockDirectionScope | undefined): boolean {
  return direction != null && scope != null && direction !== scope.around
}
