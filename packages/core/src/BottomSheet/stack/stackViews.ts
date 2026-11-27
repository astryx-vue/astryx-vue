import type { BottomSheetStackView, Entry } from './stackState.js'
import { notifyTopLayerEntry } from '../../layer/modalOutlet.js'
import { BOTTOM_SHEET_STACK_DEFAULT_VIEW, getShownOrder, setShownOrder, state } from './stackState.js'

function isSameView(a: BottomSheetStackView, b: BottomSheetStackView): boolean {
  return (Object.keys(a) as Array<keyof BottomSheetStackView>).every(key => a[key] === b[key])
}

function viewFor(entry: Entry, order: Entry[], index: number, owner: Entry | null, top: Entry | null): BottomSheetStackView {
  let depth = 0
  for (let above = index + 1; above < order.length; above += 1) {
    // 正在替换这一张的面板站在它的位置上，不算压在它上面。
    if (order[above].isOpen && order[above] !== entry.replace?.replacer)
      depth += 1
  }
  const isCovered = entry.isOpen && depth > 0
  const element = entry.getElement()
  const containsPresented = element != null && order.some((other) => {
    const otherElement = other.getElement()
    return other !== entry && otherElement != null && element.contains(otherElement)
  })
  const ownsScrim = entry === owner
  return {
    isStacked: order.length > 1,
    isTop: entry === top,
    isCovered,
    depth,
    ownsScrim,
    isScrimHandoff: ownsScrim && entry.isOpen && order.slice(0, index).some(below => !below.isOpen),
    isBlocked: isCovered && !containsPresented,
    isScrimTakenOver: !entry.isOpen && owner != null && owner !== entry,
    replacedMotion: entry.replace?.motion ?? null,
    alignmentOffset: entry.replace?.alignmentOffset ?? 0,
    isReplacing: entry.replacing != null,
  }
}

/** 算出一组面板各自的视图，变了的才通知宿主。 */
export function computeViews(order: Entry[], isModal: boolean): void {
  const openEntries = order.filter(entry => entry.isOpen)
  const top = openEntries[openEntries.length - 1] ?? null
  // 被替换的面板留着期间还拿着遮罩；替换它的面板在它离开时一下子接过去。
  const owner = order.find(entry => entry.isOpen || entry.replace != null) ?? null
  const changed: Entry[] = []
  order.forEach((entry, index) => {
    // 非模态面板不叠放：不后退、没有遮罩，视图里只有替换交接的那几项。
    const view: BottomSheetStackView = isModal
      ? viewFor(entry, order, index, owner, top)
      : {
          ...BOTTOM_SHEET_STACK_DEFAULT_VIEW,
          replacedMotion: entry.replace?.motion ?? null,
          alignmentOffset: entry.replace?.alignmentOffset ?? 0,
          isReplacing: entry.replacing != null,
        }
    if (!isSameView(entry.view, view)) {
      entry.view = view
      changed.push(entry)
    }
  })
  for (const entry of changed)
    entry.onView(entry.view)
}

/** 重新呈现时要保住焦点的元素：活动元素在一张马上要重新呈现的打开面板里。 */
function activeElementToKeep(doc: Document, reshown: readonly Entry[]): HTMLElement | null {
  const remembered = state.focusToKeep.get(doc)
  state.focusToKeep.delete(doc)
  const current = doc.activeElement
  const active = remembered != null && remembered.isConnected
    ? remembered
    : current instanceof HTMLElement && current !== doc.body ? current : null
  if (active == null)
    return null
  for (const entry of reshown) {
    const element = entry.getElement()
    if (entry.isOpen && element != null && element.contains(active))
      return active
  }
  return null
}

/**
 * 让顶层的顺序和名次一致。顶层只能往末尾追加，对话框要往上挪只能先关再重新呈现：
 * 已呈现顺序里按次序包含的、想要顺序的最长前缀原样保留，之后的都从上往下关掉，再按顺序重新呈现。
 * 有东西呈现了，焦点就进最上面那张打开的面板；人原本就在某张只是为了保位置而重新呈现的面板里时，
 * 焦点落回他原来所在的元素。
 */
export function reconcileTopLayer(doc: Document, isModal: boolean, order: Entry[]): void {
  const shownOrder = getShownOrder(doc, isModal)
  const presentable = order.filter((entry) => {
    const element = entry.getElement()
    return element != null && element.isConnected
  })
  let kept = 0
  let cursor = 0
  while (kept < presentable.length) {
    const next = shownOrder.indexOf(presentable[kept], cursor)
    if (next === -1)
      break
    cursor = next + 1
    kept += 1
  }
  const keptEntries = new Set(presentable.slice(0, kept))
  const reshown = presentable.slice(kept)
  const keptActive = activeElementToKeep(doc, reshown)
  for (let index = shownOrder.length - 1; index >= 0; index -= 1) {
    if (!keptEntries.has(shownOrder[index]))
      shownOrder[index].hide()
  }
  for (const entry of reshown) {
    const delegate = keptActive != null && entry.getElement()?.contains(keptActive) ? keptActive : null
    // 原生聚焦步骤认 `autofocus`：重新呈现的对话框落在人原来所在的元素上，而不是第一个可聚焦处。
    const hadAutofocus = delegate?.hasAttribute('autofocus') ?? false
    if (delegate != null && !hadAutofocus)
      delegate.setAttribute('autofocus', '')
    entry.show()
    if (delegate != null && !hadAutofocus)
      delegate.removeAttribute('autofocus')
  }
  setShownOrder(doc, isModal, presentable)
  if (reshown.length === 0)
    return
  // 重新呈现的对话框回到顶层最上面，压住了之前挂在它里面的全局浮层（toast）；让它们重新进顶层。
  if (reshown.some(entry => shownOrder.includes(entry)))
    notifyTopLayerEntry()
  if (keptActive != null && keptActive.isConnected) {
    if (doc.activeElement !== keptActive)
      keptActive.focus({ preventScroll: true })
    return
  }
  const openEntries = presentable.filter(entry => entry.isOpen)
  openEntries[openEntries.length - 1]?.focus('open')
}
