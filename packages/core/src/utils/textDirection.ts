/**
 * @file textDirection.ts
 * @input 组件里装调用方文字的那段内容（字符串、数字，或别的节点）
 * @output textDirection：纯文字里一个从右往左的字母都没有时答 `'ltr'`，
 *   其余情况答 `undefined`，让文字沿用页面方向
 * @position 内部工具，不从包里导出。Badge、Token、InputGroupText 把它放在
 *   装调用方文字的元素上，和 `unicode-bidi: isolate` 搭配使用
 */

/**
 * Unicode 双向算法里的强右到左字符（Bidi_Class `R` 和 `AL`）。在用的文字按名字列出
 * （阿拉伯字母标记 U+061C 属于阿拉伯文），再加上右到左标记 U+200F；
 * 两段码位范围覆盖辅助平面里的古代右到左文字和 Adlam。
 */
const STRONG_RTL = /[\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Mandaic}\p{Script=Nko}\p{Script=Samaritan}\p{Script=Syriac}\p{Script=Thaana}\u200F\u{10800}-\u{10FFF}\u{1E800}-\u{1EFFF}]/u

/** 文字里有没有任何一个强右到左字符。 */
export function hasStrongRightToLeft(text: string): boolean {
  for (const character of text) {
    if (STRONG_RTL.test(character))
      return true
  }
  return false
}

/**
 * 右到左页面上，左到右文字里的弱字符和中性字符会被重排（`https://` 显示成 `//:https`，
 * `+3` 显示成 `3+`）。所以没有右到左字母的纯文字按左到右排；有的就沿用页面方向，
 * 这样以拉丁词开头的右到左标签仍然从右往左读。别的节点不管，由调用方在自己的内容上标方向。
 */
export function textDirection(content: unknown): 'ltr' | undefined {
  if (typeof content !== 'string' && typeof content !== 'number')
    return undefined
  return hasStrongRightToLeft(String(content)) ? undefined : 'ltr'
}
