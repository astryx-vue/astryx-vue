import { focusForLastInput } from '../composables/internal/focusReturn.js'
import { devWarn } from '../composables/useDevWarning.js'
import { FOCUSABLE_SELECTOR } from './focus.js'

/**
 * 浮层关闭时的焦点归还，Popover（含 usePopover）和 Dialog 共用。
 *
 * 两条规矩：
 * - 只救「被困住」的焦点。打开期间焦点进过这一层，并且关闭时焦点还在这一层里、或者掉到了
 *   body 上，才把它送出去。焦点已经在外面（比如调用方在关闭回调里自己聚焦了别处）就不动。
 * - 送去哪里按一条候选链找，第一个「还在文档里、看得见、没禁用、不在 inert 里、不在这一层里」
 *   的元素拿到焦点。本身不能聚焦的候选临时加一个 `tabindex="-1"`，焦点离开时摘掉。
 *   焦点永远不送到 body；一个都找不到时开发期打一条警告，焦点留在原地。
 *
 * 候选链：打开时聚焦的元素 → 现在的触发器 → `aria-controls` 指向这一层的元素 → 锚点 →
 * 打开者原来的位置（它所在容器里同一序号的 Tab 停靠点，再试前一个、后一个、第一个）→
 * 打开者最近的、还在文档里的祖先 → 页面的 `main`。
 */
export interface LayerFocusRecord {
  /** 打开时聚焦的元素。 */
  readonly opener: HTMLElement | null
  /** 打开期间焦点有没有进过这一层。 */
  readonly hasEntered: boolean
  /** 停止跟踪。关闭处理完、或组件卸载时调用。 */
  stop: () => void
}

interface MutableRecord extends LayerFocusRecord {
  hasEntered: boolean
  doc: Document | null
  place: { container: Element, index: number } | null
  ancestors: Element[]
}

export interface TrackLayerFocusOptions {
  /** 这一层的容器元素，判断焦点在不在里面时读。 */
  getLayer: () => HTMLElement | null
  /** 打开者。不传就读打开这一刻聚焦的元素。 */
  opener?: HTMLElement | null
}

export interface RestoreLayerFocusOptions {
  /** 这一层的容器元素。 */
  layer: HTMLElement | null
  /** 现在的触发器。 */
  trigger?: HTMLElement | null
  /** 这一层的 id，用来找 `aria-controls` 指向它的元素。 */
  layerId?: string
  /** 和触发器分开的锚点。 */
  anchor?: HTMLElement | null
  /** 开发期警告里用的名字。 */
  name?: string
}

function documentOf(element: Element | null): Document | null {
  if (element != null)
    return element.ownerDocument
  return typeof document === 'undefined' ? null : document
}

function isDetached(doc: Document): boolean {
  const active = doc.activeElement
  return active == null || active === doc.body || active === doc.documentElement
}

function tabStopsOf(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(element => !element.hasAttribute('disabled') && element.getAttribute('tabindex') !== '-1')
}

/** 开始跟踪一层的焦点：记下打开者和它原来的位置，留意焦点有没有进过这一层。 */
export function trackLayerFocus(options: TrackLayerFocusOptions): LayerFocusRecord {
  const layer = options.getLayer()
  const doc = documentOf(layer)
  const active = doc?.activeElement
  const focused = options.opener !== undefined
    ? options.opener
    : (active instanceof HTMLElement && active !== doc?.body ? active : null)
  const opener = focused != null && layer?.contains(focused) !== true ? focused : null

  let place: MutableRecord['place'] = null
  const ancestors: Element[] = []
  if (opener != null) {
    const container = opener.parentElement
    if (container != null)
      place = { container, index: Math.max(0, tabStopsOf(container).indexOf(opener)) }
    for (let node = opener.parentElement; node != null && node !== doc?.body; node = node.parentElement)
      ancestors.push(node)
  }

  const record: MutableRecord = {
    opener,
    hasEntered: layer != null && active != null && layer.contains(active),
    doc,
    place,
    ancestors,
    stop: () => doc?.removeEventListener('focusin', onFocusIn, true),
  }

  function onFocusIn(event: FocusEvent): void {
    const current = options.getLayer()
    if (current != null && event.target instanceof Node && current.contains(event.target))
      record.hasEntered = true
  }

  doc?.addEventListener('focusin', onFocusIn, true)
  return record
}

/** 焦点是不是被困在这一层：进过这一层，并且现在在这一层里或者掉到了 body 上。 */
export function isLayerFocusStranded(record: LayerFocusRecord, layer: HTMLElement | null): boolean {
  const { doc } = record as MutableRecord
  if (!record.hasEntered || doc == null)
    return false
  const active = doc.activeElement
  return isDetached(doc) || (layer != null && active != null && layer.contains(active))
}

function isRendered(element: Element): boolean {
  const check = (element as Element & { checkVisibility?: () => boolean }).checkVisibility
  if (typeof check === 'function')
    return check.call(element)
  return element.closest('[hidden]') == null
}

function qualifies(element: Element | null | undefined, layer: HTMLElement | null): element is HTMLElement {
  if (!(element instanceof HTMLElement) || !element.isConnected)
    return false
  const doc = element.ownerDocument
  if (element === doc.body || element === doc.documentElement)
    return false
  if (layer?.contains(element) === true)
    return false
  if (element.matches(':disabled') || element.closest('[inert]') != null)
    return false
  return isRendered(element)
}

function placeCandidates(place: MutableRecord['place']): HTMLElement[] {
  if (place == null || !place.container.isConnected)
    return []
  const stops = tabStopsOf(place.container)
  const { index } = place
  return [stops[index], stops[index - 1], stops[index + 1], stops[0]].filter((stop): stop is HTMLElement => stop != null)
}

function isFocusableNow(element: HTMLElement): boolean {
  return element.matches(FOCUSABLE_SELECTOR) || element.hasAttribute('tabindex')
}

function findController(doc: Document | null, layerId: string | undefined): HTMLElement | null {
  if (doc == null || layerId == null)
    return null
  for (const element of doc.querySelectorAll<HTMLElement>('[aria-controls]')) {
    if ((element.getAttribute('aria-controls') ?? '').split(/\s+/).includes(layerId))
      return element
  }
  return null
}

/** 给本身不能聚焦的元素临时加一个 `tabindex="-1"`，焦点离开时摘掉。 */
function focusWithTemporaryStop(element: HTMLElement): void {
  if (!isFocusableNow(element)) {
    element.setAttribute('tabindex', '-1')
    element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true })
  }
  // 归还焦点不滚动页面：打开者在浮层打开时就在屏幕上，页面之后没动过。
  // WebKit 会把轻点按钮时落到的最近可聚焦祖先（如 tabindex="-1" 的主区域）记成打开者，
  // 带滚动的聚焦会把页面卷回那个区域的顶边。
  focusForLastInput(element, { preventScroll: true })
}

/**
 * 沿候选链把焦点送出这一层。只在焦点被困住时调用（见 `isLayerFocusStranded`）。
 * 返回有没有找到落点。
 */
export function restoreLayerFocus(record: LayerFocusRecord, options: RestoreLayerFocusOptions): boolean {
  const { place, ancestors, doc } = record as MutableRecord
  const { layer } = options
  const controller = findController(doc, options.layerId)
  const candidates: Array<Element | null | undefined> = [
    record.opener,
    options.trigger,
    controller,
    options.anchor,
    ...placeCandidates(place),
    ...ancestors,
    doc?.querySelector('main'),
  ]
  for (const candidate of candidates) {
    if (!qualifies(candidate, layer))
      continue
    focusWithTemporaryStop(candidate)
    if (doc?.activeElement === candidate)
      return true
  }
  devWarn(options.name ?? 'Layer', 'focus could not return anywhere after the layer closed: the opener, the trigger and every fallback are gone or cannot take focus.')
  return false
}
