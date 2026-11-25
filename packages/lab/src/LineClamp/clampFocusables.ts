import { observeResize } from '@astryx-vue/core'

/**
 * 行数截断只裁绘制，不裁布局：被裁掉那几行里的链接仍在 Tab 顺序里。
 * 这里把完全落在最后一行可见行之外的可聚焦后代标成 `inert`，重新露出来时再还原。
 */

export const ROOT_ATTRIBUTE = 'data-line-clamp-root'
const HIDDEN_ATTRIBUTE = 'data-line-clamp-hidden'

/** 和 Core 的可聚焦选择器一致，另含 summary 和带控件的媒体。 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const CANDIDATE_SELECTOR = `${FOCUSABLE_SELECTOR}, [${HIDDEN_ATTRIBUTE}]`
const BOX_ATTRIBUTES = new Set(['hidden', 'class', 'style'])

const MUTATION_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
  // hidden、class、style 也能把一个可聚焦元素挪过裁切边，所以也要重查。
  attributeFilter: ['tabindex', 'disabled', 'href', 'inert', 'contenteditable', 'hidden', 'class', 'style'],
}

/**
 * `container` 是不是离 `el` 最近的那个截断容器。嵌套的截断容器自己管自己的后代。
 * 弹出层和对话框渲染在顶层，截断容器裁不到它们，归属也就到此为止。
 */
function isOwnedBy(container: HTMLElement, el: Element): boolean {
  return el.parentElement?.closest(`[${ROOT_ATTRIBUTE}], [popover], dialog`) === container
}

/** 只加一个 `inert`：调用方自己的 tabindex 和 aria-hidden 从不改写。调用方自己设了 inert 的不归这里管。 */
function hideFromTabOrder(el: HTMLElement): void {
  if (el.hasAttribute(HIDDEN_ATTRIBUTE) || el.hasAttribute('inert'))
    return
  el.setAttribute('inert', '')
  el.setAttribute(HIDDEN_ATTRIBUTE, '')
}

function restoreFromClip(el: HTMLElement): void {
  el.removeAttribute('inert')
  el.removeAttribute(HIDDEN_ATTRIBUTE)
}

/** 没有盒子的节点（比如在 display: none 里）没有 offsetParent，按计算样式找包含块。 */
function containingBlock(node: Element): Element | null {
  if (node instanceof HTMLElement && node.offsetParent != null)
    return node.offsetParent
  if (node.getClientRects().length > 0)
    return null
  for (let ancestor = node.parentElement; ancestor != null; ancestor = ancestor.parentElement) {
    if (getComputedStyle(ancestor).position !== 'static')
      return ancestor
  }
  return null
}

/**
 * 决定 `el` 有没有被裁掉的那个盒子；`el` 在一棵从不标 inert 的子树里时为 null。
 * fixed 元素、包含块是容器本身或在容器外的 absolute 元素，都开启这样的子树。
 * 包含块在容器文档流里的 absolute 元素（控件自己定位的外壳）仍在流里，由那个包含块的位置决定。
 */
function flowBox(container: HTMLElement, el: Element): Element | null {
  let box: Element = el
  for (let node: Element | null = el; node != null && node !== container; node = node.parentElement) {
    const { position } = getComputedStyle(node)
    if (position === 'fixed')
      return null
    if (position === 'absolute') {
      const block = containingBlock(node)
      if (block == null || block === container || !container.contains(block))
        return null
      box = block
    }
  }
  return box
}

/** 查一遍：裁掉的藏起来，重新露出来的还原。`focusTarget` 是 focusout 时焦点要去的地方。 */
export function syncFocusableClipping(container: HTMLElement, focusTarget?: Element | null): void {
  const containerBottom = container.getBoundingClientRect().bottom
  const active = container.ownerDocument.activeElement
  for (const el of container.querySelectorAll<HTMLElement>(CANDIDATE_SELECTOR)) {
    if (!isOwnedBy(container, el))
      continue
    const box = flowBox(container, el)
    if (box == null) {
      if (el.hasAttribute(HIDDEN_ATTRIBUTE))
        restoreFromClip(el)
      continue
    }
    // 持有焦点的元素从不藏起来，否则焦点会从读者手里丢掉。
    const isFocused = el.contains(active) || (focusTarget != null && el.contains(focusTarget))
    // 没有盒子的候选量不出位置：display: none 的先当作在边外，等它有了盒子再查；
    // display: contents 自己没有盒子，由它的子元素当候选。
    if (el.getClientRects().length === 0) {
      if (getComputedStyle(el).display === 'contents') {
        if (el.hasAttribute(HIDDEN_ATTRIBUTE))
          restoreFromClip(el)
      }
      else if (!isFocused) {
        hideFromTabOrder(el)
      }
      continue
    }
    if (!isFocused && box.getBoundingClientRect().top >= containerBottom)
      hideFromTabOrder(el)
    else if (el.hasAttribute(HIDDEN_ATTRIBUTE))
      restoreFromClip(el)
  }
}

/**
 * 调用方往一个被藏起来的链接上写 inert，这个属性就归调用方了：去掉标记，之后露出来时保持调用方的设置。
 * 截断容器自己只会加或删这个属性，所以「从有到有」的记录就是调用方又写了一次，
 * 被藏起来却没了 inert 的，是调用方把它拿掉了。
 */
function handBackCallerInert(container: HTMLElement, records: readonly MutationRecord[]): void {
  const inertRecords = records.filter(
    (record): record is MutationRecord & { target: HTMLElement } =>
      record.type === 'attributes'
      && record.attributeName === 'inert'
      && record.target instanceof HTMLElement
      && isOwnedBy(container, record.target),
  )
  inertRecords.forEach((record, index) => {
    const target = record.target
    // 这条记录写下的值：同一元素的下一条记录把它报成旧值，最后一条就是现在的值。
    const next = inertRecords.slice(index + 1).find(candidate => candidate.target === target)
    const value = next ? next.oldValue : target.getAttribute('inert')
    if (record.oldValue != null && value != null)
      target.removeAttribute(HIDDEN_ATTRIBUTE)
  })
  for (const record of inertRecords) {
    if (!record.target.hasAttribute('inert'))
      record.target.removeAttribute(HIDDEN_ATTRIBUTE)
  }
}

/** 能改变「哪些后代可聚焦」的记录。 */
function changesFocusables(record: MutationRecord): boolean {
  return record.type === 'childList' || (record.attributeName !== 'inert' && !BOX_ATTRIBUTES.has(record.attributeName ?? ''))
}

/** hidden、class、style 的变化只在候选或候选的祖先上才要重查，容器里的装饰动画不触发。 */
function needsPass(record: MutationRecord): boolean {
  if (!BOX_ATTRIBUTES.has(record.attributeName ?? ''))
    return true
  const target = record.target
  return target instanceof Element && (target.matches(CANDIDATE_SELECTOR) || target.querySelector(CANDIDATE_SELECTOR) != null)
}

export interface ClampObservation {
  /** 先把调用方排队中的 inert 交还，再查一遍。每次渲染后调用。 */
  sync: (focusTarget?: Element | null) => void
  stop: () => void
}

/**
 * 截断容器的尺寸、内容和换行都能在不渲染的情况下把后代挪过裁切边。
 * 尺寸走 Core 共用的 ResizeObserver，内容走 MutationObserver；
 * 换行可能在盒子尺寸不变时发生（字体加载、祖先换字体），由以容器为根的 IntersectionObserver 报告跨边。
 */
export function observeClamp(container: HTMLElement): ClampObservation {
  let isStopped = false
  const pass = (focusTarget?: Element | null): void => {
    if (!isStopped)
      syncFocusableClipping(container, focusTarget)
  }

  let intersection: IntersectionObserver | null = null
  const refreshEdge = (): void => {
    if (intersection == null)
      return
    intersection.disconnect()
    for (const el of container.querySelectorAll(CANDIDATE_SELECTOR)) {
      if (isOwnedBy(container, el))
        intersection.observe(el)
    }
  }
  if (typeof IntersectionObserver !== 'undefined') {
    // 链接顶边正好压在裁切边上时相交比例是 0 但已被裁掉，所以阈值里带一个略大于 0 的值。
    intersection = new IntersectionObserver(() => pass(), { root: container, threshold: [0, 1e-6] })
    refreshEdge()
  }

  const handle = (records: readonly MutationRecord[]): void => {
    handBackCallerInert(container, records)
    if (isStopped)
      return
    if (records.some(changesFocusables))
      refreshEdge()
    if (records.some(needsPass))
      pass()
  }
  const mutations = typeof MutationObserver === 'undefined' ? null : new MutationObserver(handle)
  mutations?.observe(container, MUTATION_OPTIONS)
  const stopResize = observeResize(container, () => pass())

  return {
    sync(focusTarget) {
      const queued = mutations?.takeRecords() ?? []
      if (queued.length > 0)
        handBackCallerInert(container, queued)
      pass(focusTarget)
    },
    stop() {
      // 断开会丢掉排队中的记录，先把调用方的 inert 交还。
      const queued = mutations?.takeRecords() ?? []
      if (queued.length > 0)
        handBackCallerInert(container, queued)
      isStopped = true
      mutations?.disconnect()
      intersection?.disconnect()
      stopResize()
    },
  }
}
