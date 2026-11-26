/**
 * @file inputHoldKeptInside.ts
 * @output holdKeptInside：浮层退场期间、焦点还留在里面时的暂挡
 * @position 输入暂挡的退场部分（对应上游 Layer/inputHold 的 `scope: 'layer'`、
 *   `focus: 'kept-inside'`），关闭中的 BottomSheet 用它
 */

import type { InputHoldEnd } from './inputHoldState'
import { containsAlongFlatTree, deepActiveElement } from '../utils/flatTree'
import { isHTMLElement, isNode } from '../utils/nodeType'

/** 焦点留在退场浮层里时，还放行的键。 */
const KEPT_INSIDE_KEYS: ReadonlySet<string> = new Set(['Tab'])

const WATCHED_ATTRIBUTES = ['disabled', 'hidden', 'inert']

/**
 * 退场期间挡住 `layer`，页面照常可用：浮层让所有指针穿过去，不加挡板。
 * 焦点还在里面时，内容照样露给辅助技术，但除了 Tab 什么键、什么点击都到不了它；
 * 焦点一离开（或者本来就不在里面），浮层自己变成 `inert` + `aria-hidden`，
 * 直到暂挡结束。放开之后，排在放开前的焦点检查不再改动浮层。返回提前放开的函数。
 */
export function holdKeptInside(layer: Element, until: InputHoldEnd): () => void {
  const doc = layer.ownerDocument
  const style = isHTMLElement(layer) ? layer.style : null
  const previousPointerEvents = style?.pointerEvents ?? ''
  if (style != null)
    style.pointerEvents = 'none'
  const wasInert = layer.hasAttribute('inert')
  const previousAriaHidden = layer.getAttribute('aria-hidden')
  let isInert = false
  let isReleased = false
  const stops: (() => void)[] = []

  const hasFocusInside = (): boolean => {
    const focused = deepActiveElement(doc)
    return focused != null && containsAlongFlatTree(layer, focused)
  }
  const stopWatching = (): void => {
    for (const stop of stops.splice(0))
      stop()
  }
  const makeInert = (): void => {
    if (isInert || isReleased)
      return
    isInert = true
    stopWatching()
    layer.setAttribute('inert', '')
    layer.setAttribute('aria-hidden', 'true')
  }

  if (!hasFocusInside()) {
    makeInert()
  }
  else {
    // 在文档的捕获阶段停下：交互方式追踪器在那里更早注册，照样听得到按键；
    // 浮层里面的监听（包括捕获阶段的）都听不到。
    const isInLayer = (event: Event): boolean => {
      const target = typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target
      return isNode(target) && containsAlongFlatTree(layer, target)
    }
    const stopActivation = (event: Event): void => {
      if (isInLayer(event)) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }
    const stopKey = (event: Event): void => {
      if (!KEPT_INSIDE_KEYS.has((event as KeyboardEvent).key))
        stopActivation(event)
    }
    const captures: [string, (event: Event) => void][] = [
      ['click', stopActivation],
      ['keydown', stopKey],
      ['keyup', stopKey],
    ]
    for (const [type, listener] of captures) {
      doc.addEventListener(type, listener, { capture: true })
      stops.push(() => doc.removeEventListener(type, listener, { capture: true }))
    }
    const makeInertIfFocusLeft = (): void => {
      if (!hasFocusInside())
        makeInert()
    }
    // 事件之后、焦点落定时再读。Firefox 和 WebKit 对被移除的元素不发 focusout，所以子树变化也要读。
    const onFocusOut = (): void => queueMicrotask(makeInertIfFocusLeft)
    layer.addEventListener('focusout', onFocusOut)
    stops.push(() => layer.removeEventListener('focusout', onFocusOut))
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(makeInertIfFocusLeft)
      observer.observe(layer, { childList: true, subtree: true, attributeFilter: WATCHED_ATTRIBUTES })
      stops.push(() => observer.disconnect())
    }
  }

  const release = (): void => {
    if (isReleased)
      return
    isReleased = true
    stopWatching()
    if (style != null)
      style.pointerEvents = previousPointerEvents
    if (isInert) {
      if (!wasInert)
        layer.removeAttribute('inert')
      if (previousAriaHidden == null)
        layer.removeAttribute('aria-hidden')
      else
        layer.setAttribute('aria-hidden', previousAriaHidden)
    }
  }
  const end = 'finished' in until ? until.finished : until
  void Promise.resolve(end).then(release, release)
  return release
}
