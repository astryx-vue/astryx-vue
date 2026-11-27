/**
 * @file listPresentation.ts
 * @input List 的行元素、它和它子元素上正在跑的 Web Animations 与行内样式
 * @output 这次更新里列表报告过的行（`setReportedRows`、`isReportedRow`），
 *   以及离开的行退场时保持离开那一刻的样子（`keepPresentation`、`showAsItLeft`）
 * @position List 内部，listLayoutUpdates 和 ListItem 共用；不从包入口导出
 *
 * 两张表都放在跨副本共享的 WeakMap 里：包里的 List 和项目里自己拷的 ListItem（或反过来）
 * 读写的是同一份。
 */
import { sharedWeakMap } from '../utils/sharedRealm.js'

/** 每个列表在进行中的这次更新里报告过的行，只有它们能播退场。 */
const reportedRows = sharedWeakMap<Element, ReadonlySet<Element>>('list/list-layout-updates/reported-rows', 1)

/** 记下 `list` 这次更新报告过的行；传 null 清掉。 */
export function setReportedRows(list: Element, rows: ReadonlySet<Element> | null): void {
  if (rows == null)
    reportedRows.delete(list)
  else
    reportedRows.set(list, rows)
}

/** `row` 所在的列表这次更新有没有报告它。 */
export function isReportedRow(row: Element): boolean {
  const list = row.parentElement
  return list != null && (reportedRows.get(list)?.has(row) ?? false)
}

type KeptStyles = ReadonlyArray<readonly [HTMLElement | SVGElement, string]>

/** 离开的行和它的子元素离开时显示的行内样式（比如横滑的位移），退场时写回去。 */
const keptStyles = sharedWeakMap<HTMLElement, KeptStyles>('list/list-layout-updates/kept-styles', 1)

/**
 * 把 `row` 和它子元素上正在跑的 Web Animations 此刻呈现的样子记成行内样式。
 * 行被移出文档时这些动画会丢；退场时把行放回去、写回记录，它就停在离开那一刻的样子。
 * ListItem 在行卸载前（还在文档里）调用。伪元素上的、写不出数值的动画不管。
 */
export function keepPresentation(row: HTMLElement): void {
  if (typeof row.getAnimations !== 'function')
    return
  const parts = [row, ...row.querySelectorAll<HTMLElement | SVGElement>('*')]
  const before = parts.map(part => part.getAttribute('style'))
  // 读动画呈现的值只能靠 commitStyles，它会写进元素的 style；读完再把每个元素原来的 style 还回去。
  for (const animation of row.getAnimations({ subtree: true })) {
    try {
      animation.commitStyles()
    }
    catch {
      // 伪元素上的、没有渲染的目标上的动画：没什么可记的。
    }
  }
  // 子元素的主人随后清理时可能重置样式（横滑把位移归零），记录里保留离开那一刻的值。
  const styled: (readonly [HTMLElement | SVGElement, string])[] = []
  parts.forEach((part, index) => {
    if (part.style.length > 0)
      styled.push([part, part.style.cssText])
    const style = before[index]
    if (part.getAttribute('style') !== style) {
      if (style == null)
        part.removeAttribute('style')
      else
        part.style.cssText = style
    }
  })
  keptStyles.set(row, styled)
}

/**
 * 离开的行放回文档后，子元素的动画会重新盖上来。这里停掉它们、写回记录，
 * 让行显示离开那一刻屏幕上的样子。
 */
export function showAsItLeft(row: HTMLElement): void {
  if (typeof row.getAnimations === 'function') {
    for (const animation of row.getAnimations({ subtree: true }))
      animation.cancel()
  }
  for (const [part, cssText] of keptStyles.get(row) ?? [])
    part.style.cssText = cssText
  keptStyles.delete(row)
}
