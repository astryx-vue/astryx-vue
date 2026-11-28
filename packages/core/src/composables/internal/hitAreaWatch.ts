import type { HitInsets, HitRect } from './hitArea.js'
import type { MovingScope } from './hitAreaGate.js'
import {
  clampedHitInsets,
  distanceTo,
  grown,
  inLayout,
  MIN_TOUCH_TARGET,
  NO_HIT_INSETS,
  plainRect,
  sameInsets,
  screenScale,
} from './hitArea.js'
import { applyMutations, groupUnder, interactiveWithin, ungroup } from './hitAreaCandidates.js'
import { afterMotion, isPageScrolling, motionAbove, movingScopes, whenScrollIdle } from './hitAreaGate.js'

/**
 * @file hitAreaWatch.ts
 * @input 被看着的控件，以及它周围页面上的可点元素
 * @output `watchHitArea`：让一个控件的热区随布局实时更新
 * @position 内部工具。`useTouchHitArea` 把它接进 Vue 组件。
 *
 * CSS 看不到邻居，所以要测量：只在主要指针是粗指针时测，并且所有控件共用一次「每帧一读」的测量，
 * 一帧最多花 4ms，剩下的留到下一帧。第一次测量前热区是 0，首帧不会盖住任何东西。
 * 细指针下除了指针媒体查询什么都不监听。
 *
 * 测量不能抢在手指前面读布局：
 * - 页面在滚动时不测，到 `scrollend` 或 150ms 没有滚动事件再测（见 hitAreaGate.ts）；
 * - 祖先在播会挪盒子的有限动画（比如一层界面滑进来）时，这个控件先不测，等动画播完；
 * - 手指按下时不读任何矩形，只挂上一次对点击的复查：点击只在这次触摸成了轻点时才来，
 *   滚动里不会有。复查读控件的盒子（按布局像素，去掉按压自己的缩放），不写热区，
 *   按压动效结束后的那次测量才写。
 */

const TOUCH_QUERY = '(pointer: coarse)'
/** 一帧里花在控件上的时间上限，ms。 */
const FRAME_BUDGET_MS = 4
/** 页面结构变了以后等它稳定多久再重新测量，ms。旁边的文字或链接可能挪动而控件本身不变大小。 */
const CONTENT_SETTLE_MS = 100
const PASSIVE_CAPTURE = { capture: true, passive: true } as const
/** 会改变「哪些元素可点」的变化。 */
const CANDIDATE_MUTATIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['href', 'type', 'for', 'contenteditable', 'role', 'tabindex', 'disabled'],
}

export interface WatchHitAreaOptions {
  /**
   * 碰到邻居之前每一边长多少，在测量时读。组传成员的 `groupGrowth`。
   * @default 每条轴居中朝 44px 长
   */
  readonly growth?: (target: HitRect, element: HTMLElement) => HitInsets
  /**
   * 手指轻点时是否对照页面复查一次：邻居在上次测量后挪近了，这次点按就作废，不会点错。
   * 自己在按下时读成员位置的组关掉它。
   * @default true
   */
  readonly checkAtPress?: boolean
}

interface Watch {
  readonly element: HTMLElement
  readonly growth?: WatchHitAreaOptions['growth']
  readonly checkAtPress: boolean
  readonly onInsets: (insets: HitInsets) => void
  last: HitInsets
  isVisible: boolean
  /** 上一次测量因为祖先的动画被留下，没有量。 */
  isHeld: boolean
}

interface Candidate {
  readonly element: Element
  readonly rect: HitRect
}

const watches = new Map<Element, Watch>()
const pending = new Set<Watch>()
let view: Window | null = null
let pointer: MediaQueryList | null = null
let isCoarse = false
let frame: number | null = null
let settleTimer: ReturnType<typeof setTimeout> | null = null
let resize: ResizeObserver | null = null
let visibility: IntersectionObserver | null = null
let mutations: MutationObserver | null = null
let stopScrollGate: (() => void) | null = null
/** 页面上的可点元素，随变化增量维护；没有 MutationObserver 的环境每次重新查。 */
let candidates: Set<Element> | null = null
/** 轻点时的复查，按被看着的元素记；取消就是撤掉它的监听。 */
const disarms = new Map<Element, () => void>()

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

function deliver(watch: Watch, insets: HitInsets): void {
  if (sameInsets(watch.last, insets))
    return
  watch.last = insets
  watch.onInsets(insets)
}

/** 包含 `element` 的、被看着的元素（含它自己）。 */
function watchedOwner(element: Element): Element | null {
  for (let node: Element | null = element; node != null; node = node.parentElement) {
    if (watches.has(node))
      return node
  }
  return null
}

function ownerOf(element: Element): Element {
  return watchedOwner(element) ?? element
}

/** 页面上的可点元素。被看着的控件按它自己的盒子算，不按它里面的部件算。 */
function interactiveElements(doc: Document): Set<Element> {
  if (candidates == null || mutations == null)
    candidates = new Set(interactiveWithin(doc, ownerOf))
  return candidates
}

/** 读候选的矩形；挪着的祖先下面的元素不算邻居，它们的位置马上就变。 */
function readCandidates(doc: Document, scopes: readonly MovingScope[] = []): Candidate[] {
  const read: Candidate[] = []
  for (const element of interactiveElements(doc)) {
    if (scopes.length === 0 || motionAbove(scopes, element).length === 0)
      read.push({ element, rect: plainRect(element) })
  }
  return read
}

/** `candidate` 是控件自己或它的一部分（含指向它的 `<label for>`）。 */
function isOwn(element: Element, candidate: Element): boolean {
  if (candidate === element || candidate.contains(element) || element.contains(candidate))
    return true
  const control = (candidate as HTMLLabelElement).control
  return control != null && element.contains(control)
}

function measureOne(watch: Watch, all: ReadonlyArray<Candidate>): { target: HitRect, insets: HitInsets, neighbours: HitRect[] } {
  const target = plainRect(watch.element)
  const scale = screenScale(watch.element, target)
  // 两个各自最多长半个最小尺寸的目标，相距一个最小尺寸以内才可能碰上。
  const band = grown(target, {
    top: MIN_TOUCH_TARGET * scale.y,
    right: MIN_TOUCH_TARGET * scale.x,
    bottom: MIN_TOUCH_TARGET * scale.y,
    left: MIN_TOUCH_TARGET * scale.x,
  })
  const neighbours = all
    .filter(({ element, rect }) =>
      rect.right > rect.left
      && rect.bottom > rect.top
      && rect.left < band.right && band.left < rect.right && rect.top < band.bottom && band.top < rect.bottom
      && !isOwn(watch.element, element))
    .map(({ rect }) => rect)
  return {
    target,
    // 热区是控件自己盒子里的长度，所以用布局像素量：从小比例展开的层停稳后保留的是最终大小的热区。
    // 返回的矩形仍是屏幕像素，供触摸的距离判断用。
    insets: clampedHitInsets(
      inLayout(target, target, scale),
      neighbours.map(rect => inLayout(rect, target, scale)),
      MIN_TOUCH_TARGET,
      watch.growth?.(target, watch.element),
    ),
    neighbours,
  }
}

/** 一次测量：先读完所有待测控件，再统一写。滚动中不测，祖先在挪时留下那个控件。 */
function measure(): void {
  frame = null
  if (isPageScrolling())
    return
  const due = [...pending].filter(watch => watch.isVisible)
  pending.clear()
  if (!isCoarse || due.length === 0)
    return
  const doc = due[0].element.ownerDocument
  const scopes = movingScopes(doc)
  const ready: Watch[] = []
  for (const watch of due) {
    const waits = motionAbove(scopes, watch.element)
    watch.isHeld = waits.length > 0
    if (watch.isHeld)
      afterMotion(waits, () => schedule(watch))
    else
      ready.push(watch)
  }
  if (ready.length === 0)
    return
  const all = readCandidates(doc, scopes)
  const started = now()
  const results: Array<{ watch: Watch, insets: HitInsets }> = []
  for (const watch of ready) {
    if (results.length > 0 && now() - started > FRAME_BUDGET_MS) {
      pending.add(watch)
      continue
    }
    results.push({ watch, insets: measureOne(watch, all).insets })
  }
  for (const { watch, insets } of results)
    deliver(watch, insets)
  if (pending.size > 0)
    requestFrame()
}

function requestFrame(): void {
  if (frame == null && !isPageScrolling() && typeof requestAnimationFrame === 'function')
    frame = requestAnimationFrame(measure)
}

function schedule(watch: Watch): void {
  if (!isCoarse || !watches.has(watch.element))
    return
  pending.add(watch)
  requestFrame()
}

function scheduleAll(): void {
  watches.forEach(schedule)
}

function onMutation(records: MutationRecord[]): void {
  if (candidates != null)
    applyMutations(candidates, records, ownerOf)
  if (settleTimer != null)
    clearTimeout(settleTimer)
  settleTimer = setTimeout(() => {
    settleTimer = null
    scheduleAll()
  }, CONTENT_SETTLE_MS)
}

/**
 * 手指按下时不读任何矩形。控件在测量里被动画留着（它的位置还在手指落下的地方）就此刻量；
 * 否则挂上一次对点击的复查，滚动不会触发点击，所以滚动里什么都不读。
 */
function onPress(event: Event): void {
  const press = event as PointerEvent
  const owner = press.target instanceof Element ? watchedOwner(press.target) : null
  if (owner == null)
    return
  disarms.get(owner)?.()
  const watch = watches.get(owner)
  if (watch == null || !isCoarse || press.pointerType !== 'touch' || !watch.checkAtPress)
    return
  const at = { x: press.clientX, y: press.clientY }
  if (watch.isHeld)
    checkTap(watch, at, null)
  else
    armClickCheck(watch, at)
}

/**
 * 轻点来了（或按下时控件被留着）：对照页面读一次盒子，触摸离某个邻居比离控件更近就吞掉这次点击，
 * 好过点错控件。只读不写热区：按压自己的动效正在播，写进去的是过渡中的值；
 * 之后排的那次测量会等动效播完再写。
 * 点击来之前有祖先动画挪了盒子，就放行这次点击，由浏览器的命中测试决定；挪着的邻居也不算。
 */
function checkTap(watch: Watch, at: { x: number, y: number }, click: Event | null): void {
  const doc = watch.element.ownerDocument
  const scopes = movingScopes(doc)
  schedule(watch)
  if (click != null && motionAbove(scopes, watch.element).length > 0)
    return
  const { target, neighbours } = measureOne(watch, readCandidates(doc, scopes))
  const own = distanceTo(target, at.x, at.y)
  if (click == null || !neighbours.some(rect => distanceTo(rect, at.x, at.y) < own))
    return
  click.preventDefault()
  click.stopPropagation()
}

/** 挂上对 `watch` 控件下一次触摸点击的复查；下一次按下或这次触摸被浏览器拿走（滚动）都会撤掉它。 */
function armClickCheck(watch: Watch, at: { x: number, y: number }): void {
  const owner = watch.element
  const doc = owner.ownerDocument
  function disarm(): void {
    owner.removeEventListener('click', check, true)
    owner.removeEventListener('pointercancel', disarm, true)
    doc.removeEventListener('pointerdown', disarm, PASSIVE_CAPTURE)
    if (disarms.get(owner) === disarm)
      disarms.delete(owner)
  }
  function check(click: Event): void {
    disarm()
    // 键盘或辅助技术触发的点击（detail 为 0）不是这次触摸的，放过。
    if ((click as MouseEvent).detail === 0)
      return
    checkTap(watch, at, click)
  }
  owner.addEventListener('click', check, true)
  owner.addEventListener('pointercancel', disarm, true)
  // 加在这次按下经过 document 之后，只有下一次按下才会撤掉它。
  doc.addEventListener('pointerdown', disarm, PASSIVE_CAPTURE)
  disarms.set(owner, disarm)
}

function observe(watch: Watch): void {
  visibility?.observe(watch.element)
  resize?.observe(watch.element)
  if (watch.element.parentElement != null)
    resize?.observe(watch.element.parentElement)
}

function unobserve(element: Element, parent: Element | null): void {
  visibility?.unobserve(element)
  resize?.unobserve(element)
  const parentShared = [...watches.keys()].some(other => other.parentElement === parent)
  if (parent != null && !parentShared)
    resize?.unobserve(parent)
  disarms.get(element)?.()
}

/** 只在粗指针下打开的那些观察：尺寸、可见、页面结构、窗口大小、滚动，和按下时的复查。 */
function startObserving(): void {
  if (view == null)
    return
  const doc = view.document
  view.addEventListener('resize', scheduleAll)
  doc.addEventListener('pointerdown', onPress, PASSIVE_CAPTURE)
  stopScrollGate = whenScrollIdle(doc, () => {
    if (pending.size > 0)
      requestFrame()
  })
  if (typeof ResizeObserver === 'function') {
    resize = new ResizeObserver((entries) => {
      for (const entry of entries) {
        for (const [element, watch] of watches) {
          if (element === entry.target || element.parentElement === entry.target)
            schedule(watch)
        }
      }
    })
  }
  if (typeof IntersectionObserver === 'function') {
    visibility = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const watch = watches.get(entry.target)
        if (watch == null)
          continue
        watch.isVisible = entry.isIntersecting
        if (watch.isVisible)
          schedule(watch)
        else
          pending.delete(watch)
      }
    })
  }
  if (typeof MutationObserver === 'function') {
    mutations = new MutationObserver(onMutation)
    mutations.observe(doc, CANDIDATE_MUTATIONS)
  }
  for (const watch of watches.values()) {
    observe(watch)
    schedule(watch)
  }
}

function stopObserving(): void {
  view?.removeEventListener('resize', scheduleAll)
  view?.document.removeEventListener('pointerdown', onPress, PASSIVE_CAPTURE)
  stopScrollGate?.()
  stopScrollGate = null
  resize?.disconnect()
  visibility?.disconnect()
  mutations?.disconnect()
  resize = null
  visibility = null
  mutations = null
  candidates = null
  if (settleTimer != null)
    clearTimeout(settleTimer)
  settleTimer = null
  if (frame != null && typeof cancelAnimationFrame === 'function')
    cancelAnimationFrame(frame)
  frame = null
  pending.clear()
  disarms.forEach(disarm => disarm())
}

function onPointerChange(): void {
  const next = pointer?.matches ?? false
  if (next === isCoarse)
    return
  isCoarse = next
  if (isCoarse) {
    startObserving()
    return
  }
  stopObserving()
  watches.forEach(watch => deliver(watch, NO_HIT_INSETS))
}

/**
 * 让 `element` 的热区一直跟着布局走，直到调用返回的函数：每次变化都交给 `onInsets`。
 * 细指针下热区是 0；粗指针下在挂上时、自身或父元素尺寸变化、窗口变化、页面结构稳定后重新测量，
 * 都并进每帧一次的共用测量里（滚动和祖先动画播放期间不测）；手指轻点时再对照页面复查一次。
 */
export function watchHitArea(
  element: HTMLElement,
  onInsets: (insets: HitInsets) => void,
  { growth, checkAtPress = true }: WatchHitAreaOptions = {},
): () => void {
  const owner = element.ownerDocument.defaultView
  if (owner == null || watches.has(element))
    return () => {}
  view = owner
  // 每次都重新读指针查询：换掉了 matchMedia 的环境（测试）不会留下过期的答案。
  const query = owner.matchMedia?.(TOUCH_QUERY) ?? null
  if (query !== pointer) {
    pointer?.removeEventListener('change', onPointerChange)
    pointer = query
    pointer?.addEventListener('change', onPointerChange)
  }
  const watch: Watch = { element, growth, checkAtPress, onInsets, last: NO_HIT_INSETS, isVisible: true, isHeld: false }
  watches.set(element, watch)
  // 它里面的可点部件并成它自己；只动这棵子树。
  if (candidates != null)
    groupUnder(candidates, element)
  if (isCoarse) {
    observe(watch)
    schedule(watch)
  }
  onPointerChange()
  const parent = element.parentElement
  return () => {
    if (watches.get(element) !== watch)
      return
    watches.delete(element)
    pending.delete(watch)
    if (candidates != null)
      ungroup(candidates, element, ownerOf)
    unobserve(element, parent)
    if (watches.size === 0) {
      stopObserving()
      pointer?.removeEventListener('change', onPointerChange)
      pointer = null
      view = null
      isCoarse = false
    }
  }
}
