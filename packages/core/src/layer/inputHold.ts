/**
 * @file inputHold.ts
 * @input 浮层根元素、什么时候放开（promise 或动画句柄）、暂挡的范围
 * @output holdInput、isInHeldLayer：浮层在手指下呈现期间把输入挡在它外面，退场期间连内容一起挡住；
 *   holdKeptInside：退场时焦点还留在里面的暂挡
 * @position 浮层运行时唯一的输入暂挡（对应上游 Layer/inputHold），手势宿主通过
 *   `gestures/touchHold` 问它某一下触摸要不要挡
 */

import type { InputHoldEnd, InputHoldScope } from './inputHoldState'
import { registerTouchHold } from '../gestures/touchHold'
import { parentAcrossShadow } from '../utils/flatTree'
import { isDocument, isElement } from '../utils/nodeType'
import { isInNestedLayer, makeContentInert, restoreContent } from './inputHoldInert'
import { pressHoldFor } from './inputHoldPress'
import { addShield, openToEarlierPresses, openToMouse, removeShield } from './inputHoldShield'
import { held, heldDocuments, isInputShield, isMouseLast, liveLayers } from './inputHoldState'

export { holdKeptInside } from './inputHoldKeptInside'
export type { InputHoldEnd, InputHoldScope } from './inputHoldState'
export { isInputShield } from './inputHoldState'

export interface InputHoldOptions {
  /** settle 时放开。 */
  until: InputHoldEnd
  /** 模态浮层进场用 `'viewport'`，非模态浮层进场用 `'surface'`，浮层退场用 `'layer'`。 */
  scope: InputHoldScope
}

/** `target` 是否在一个被挡着的浮层里，沿扁平树往上找。 */
export function isInHeldLayer(target: Node | null): boolean {
  for (let node: Node | null = target; node != null; node = parentAcrossShadow(node)) {
    if (isElement(node) && held.has(node))
      return true
  }
  return false
}

/**
 * 手势宿主问的那一句：`target` 上这一下触摸要不要挡。落在挡板上的都挡；
 * 落在退场浮层里的，除了它里面的另一个浮层，什么指针都挡；落在进场浮层里的，
 * 除了鼠标都挡。什么都没挡时立刻答否。
 */
function holdsTouch(target: Node): boolean {
  const doc = isDocument(target) ? target : target.ownerDocument
  if (doc == null || !heldDocuments.has(doc))
    return false
  if (isInputShield(target))
    return true
  let isHeld = false
  for (let node: Node | null = target; node != null; node = parentAcrossShadow(node)) {
    const state = isElement(node) ? held.get(node) : undefined
    if (state == null)
      continue
    const isNested = state.layer > 0 && isInNestedLayer(target, node)
    if (state.layer > 0 && !isNested)
      return true
    if (!isNested || state.viewport > 0 || state.surface > 0)
      isHeld = true
  }
  return isHeld && !isMouseLast(doc)
}

let isRegistered = false

function startHolding(layer: Element): void {
  if (!isRegistered) {
    isRegistered = true
    registerTouchHold(holdsTouch)
  }
  const doc = layer.ownerDocument
  let layers = heldDocuments.get(doc)
  if (layers == null) {
    layers = new Set()
    heldDocuments.set(doc, layers)
  }
  layers.add(layer)
  pressHoldFor(doc)?.hold()
}

function stopHolding(layer: Element): void {
  heldDocuments.get(layer.ownerDocument)?.delete(layer)
  liveLayers(layer.ownerDocument)
}

/**
 * 在 `until` settle 之前把输入挡在 `layer` 外面，返回提前放开的函数（重复调用无害）。
 * 同一个浮层上的几次暂挡叠在一起，最后一次放开时浮层才恢复。每个事件按它自己的
 * 指针判断，不看主指针，所以触屏上的鼠标在呈现期间照样能点。
 */
export function holdInput(layer: Element, { until, scope }: InputHoldOptions): () => void {
  let state = held.get(layer)
  if (state == null) {
    state = { viewport: 0, layer: 0, surface: 0, shield: null, isShieldFull: false, pressOpenings: new Set(), inertContent: null }
    held.set(layer, state)
  }
  startHolding(layer)
  const isFull = scope !== 'surface'
  const raisesFullShield = isFull && (state.shield == null || !state.isShieldFull)
  if (state.shield != null && isFull && !state.isShieldFull) {
    // 只盖自己的挡板让位给盖满视口的。
    removeShield(state.shield)
    state.shield = null
  }
  if (state.shield == null) {
    state.isShieldFull = isFull || state.viewport > 0 || state.layer > 0
    state.shield = addShield(layer, state.isShieldFull)
    // 输入流最后一下是鼠标时，挡板一开始就让鼠标过去，鼠标停着的地方按下去照常生效。
    if (isMouseLast(layer.ownerDocument))
      state.shield.style.pointerEvents = 'none'
  }
  if (scope === 'viewport')
    state.viewport += 1
  else if (scope === 'layer')
    state.layer += 1
  else
    state.surface += 1
  if (scope === 'layer') {
    // 退场挡住每一种指针，鼠标也不让路。
    state.shield.style.pointerEvents = 'auto'
    state.shield.style.removeProperty('clip-path')
    if (state.layer === 1)
      state.inertContent = makeContentInert(layer, state.shield)
  }
  if (raisesFullShield)
    openToEarlierPresses(state, layer.ownerDocument)
  openToMouse(state, layer.ownerDocument)

  let isReleased = false
  const release = (): void => {
    if (isReleased)
      return
    isReleased = true
    const current = held.get(layer)
    if (current == null)
      return
    if (scope === 'viewport')
      current.viewport -= 1
    else if (scope === 'layer')
      current.layer -= 1
    else
      current.surface -= 1
    if (scope === 'layer' && current.layer === 0 && current.inertContent != null) {
      restoreContent(current.inertContent)
      current.inertContent = null
    }
    if (current.viewport === 0 && current.layer === 0 && current.surface === 0) {
      if (current.shield != null)
        removeShield(current.shield)
      held.delete(layer)
      stopHolding(layer)
    }
  }
  const end = 'finished' in until ? until.finished : until
  void Promise.resolve(end).then(release, release)
  return release
}
