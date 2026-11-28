/**
 * @file inputHoldState.ts
 * @output 输入暂挡的共享登记：哪些浮层正被挡着、各文档的按压暂挡、哪些元素是挡板
 * @position `inputHold.ts`、`inputHoldShield.ts`、`inputHoldPress.ts` 共用的状态，
 *   按 realm 共享，页面上另一份 core 副本挡住的浮层，手势宿主一样看得见
 */

import { getLastPointerType } from '../utils/inputStream'
import { sharedState } from '../utils/sharedRealm'

/**
 * 暂挡的范围。`'viewport'`：一块盖满视口的挡板，模态浮层进场时用；
 * `'layer'`：同样盖满视口，并且把浮层内容变成 inert、把焦点移出去，浮层退场时用，
 * 它里面的另一个浮层（模态框托管的 toast 区域）照常可用；
 * `'surface'`：只挡浮层自己那块，周围页面照常可点，非模态浮层进场时用。
 */
export type InputHoldScope = 'viewport' | 'layer' | 'surface'

/** 什么时候放开：一个 promise，或者带 `finished` 的动画句柄。 */
export type InputHoldEnd
  = PromiseLike<unknown> | { readonly finished: PromiseLike<unknown> }

export interface HeldLayer {
  viewport: number
  /** 退场暂挡（`'layer'`）的层数。 */
  layer: number
  surface: number
  /** 退场暂挡变成 inert 的内容，以及它们原来是不是 inert。 */
  inertContent: Map<Element, boolean> | null
  shield: HTMLElement | null
  /** 挡板盖满视口，还是只盖浮层自己。 */
  isShieldFull: boolean
  /**
   * 满屏挡板升起时已经按着的手指和笔的 pointerId。挡板在每一下最后被听到的
   * 位置留个口子，直到这一下抬起。
   */
  pressOpenings: Set<number>
}

/** 一个文档的按压暂挡，窗口上的订阅开着时才有。 */
export interface PressHold {
  /** 有浮层被挡：新的按压又要挡。 */
  hold: () => void
  /** 不再挡新的按压；已经挡下的跟到它们结束。 */
  release: () => void
  /** 这个 pointerId 的按压是不是被挡到结束。 */
  holds: (pointerId: number) => boolean
}

export const { held, heldDocuments, pressHolds, liveShields } = sharedState(
  'layer/input-hold/state',
  1,
  () => ({
    held: new WeakMap<Element, HeldLayer>(),
    /** 每个文档里被挡着的浮层，先挡的在前。 */
    heldDocuments: new WeakMap<Document, Set<Element>>(),
    pressHolds: new WeakMap<Document, PressHold>(),
    liveShields: new WeakSet<Node>(),
  }),
)

/** 共享输入流最后送来的指针事件是不是鼠标的。 */
export function isMouseLast(doc: Document | null): boolean {
  const view = doc?.defaultView
  return view != null && getLastPointerType(view) === 'mouse'
}

/** `node` 是不是一块正在生效的挡板。需要看穿挡板的命中测试跳过它。 */
export function isInputShield(node: Node | null): boolean {
  return node != null && liveShields.has(node)
}

/**
 * 文档里还在文档中的被挡浮层，先挡的在前。离开文档的浮层不再挡什么；
 * 一个都不剩时，按压暂挡不再接新的按压，等已挡的按压结束后退订。
 */
export function liveLayers(doc: Document): Element[] {
  const layers = heldDocuments.get(doc)
  if (layers == null)
    return []
  for (const layer of layers) {
    if (!layer.isConnected)
      layers.delete(layer)
  }
  if (layers.size > 0)
    return [...layers]
  heldDocuments.delete(doc)
  pressHolds.get(doc)?.release()
  return []
}
