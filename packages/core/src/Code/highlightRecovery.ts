/**
 * 高亮范围（Range）挂在文本节点上。节点只要被移出文档，哪怕马上放回原处
 * （外层滚动容器包裹内容、Teleport、列表重排都会这样做），浏览器都会把节点里
 * 的 Range 折叠成零长度，颜色就消失了，而组件自己察觉不到。
 *
 * 这里用一个全局 MutationObserver 统一兜底：文档里有节点增删后，检查每组
 * 已绘制的范围，发现被折叠的就整组重画。高亮不改 DOM，重画不会再触发观察者。
 */

export interface PaintedRange {
  highlight: Highlight
  range: Range
}

type Check = () => void

const checks = new Set<Check>()
let observer: MutationObserver | null = null

function runChecks(): void {
  for (const check of checks)
    check()
}

function track(check: Check): void {
  checks.add(check)
  if (observer != null || typeof MutationObserver === 'undefined' || typeof document === 'undefined')
    return
  observer = new MutationObserver(runChecks)
  observer.observe(document.documentElement, { childList: true, subtree: true })
}

function untrack(check: Check): void {
  checks.delete(check)
  if (checks.size === 0) {
    observer?.disconnect()
    observer = null
  }
}

function erase(painted: PaintedRange[]): void {
  for (const { highlight, range } of painted)
    highlight.delete(range)
}

/**
 * 执行 paint 并持续守护结果：范围被 DOM 移动折叠后自动重画。
 * paint 只应加入非空范围，否则会被误判成「已折叠」。
 * 返回的函数移除全部范围并停止守护。
 */
export function paintWithRecovery(paint: () => PaintedRange[]): () => void {
  let painted = paint()
  if (painted.length === 0)
    return () => {}

  const check: Check = () => {
    if (!painted.some(({ range }) => range.collapsed))
      return
    erase(painted)
    painted = paint()
  }
  track(check)

  return () => {
    untrack(check)
    erase(painted)
  }
}
