import type { ComputedRef, CSSProperties, Ref } from 'vue'
import type { LogicalAxisMapping, MeasuredScrollAxisState } from './internal/scrollGeometry.js'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import {
  axisStatesEqual,
  DEFAULT_AXIS_MAPPING,
  getLogicalAxisMapping,
  INACTIVE_AXIS_STATE,
  isMeasurable,
  mappingsEqual,
  measureOverflow,
  measureScrollAxis,
} from './internal/scrollGeometry.js'
import { watchScrollInvalidation } from './internal/scrollInvalidation.js'
import { attachScrollKeyboardDelegation } from './internal/scrollKeyboardDelegation.js'
import { registerScrollOwner, unregisterScrollOwner } from './internal/scrollOwnerRegistry.js'

export type ScrollAxis = 'inline' | 'block' | 'both'
export type ScrollOverscroll = 'allow' | 'contain'
export type ScrollStickyContainment = 'whenScrollable' | 'always'
export type ScrollRole = 'group' | 'region'

/**
 * 能滚动时，键盘从哪里进来。
 * - `content`：内容自己有可聚焦的东西（例如表格的单元格），视口不进 Tab 顺序，也不带名字。
 * - `viewport`：视口在能滚动时成为一个 Tab 停靠点，带上名字和角色。
 * - `contentOrViewport`：同上；但 Tab 进来时，如果内容里第一个就是普通按钮或链接，焦点直接交给它。
 */
export type ScrollKeyboardAccess
  = | { owner: 'content' }
    | { owner: 'viewport', label: string, role?: ScrollRole }
    | { owner: 'contentOrViewport', label: string, role?: ScrollRole }

export type ScrollAxisState = MeasuredScrollAxisState

export interface ScrollableAreaState {
  inline: ScrollAxisState
  block: ScrollAxisState
}

export interface UseScrollableAreaOptions {
  /** @default 'block' */
  axis?: ScrollAxis
  /** 键盘归属。不传时按 `{ owner: 'viewport', label, role }`。 */
  keyboardAccess?: ScrollKeyboardAccess
  /** 视口的无障碍名称。只在没传 `keyboardAccess` 时用。 */
  label?: string
  /** @default 'group' */
  role?: ScrollRole
  /** @default 'allow' */
  overscroll?: ScrollOverscroll
  /** @default 'whenScrollable' */
  stickyContainment?: ScrollStickyContainment
}

export interface UseScrollableAreaResult {
  /** 绑到视口的 `:ref` 上。 */
  viewport: (element: unknown) => void
  /** 绑到内容的 `ref` 上。 */
  content: Ref<HTMLElement | null>
  /** 用 `v-bind` 摊到视口上：角色、名字、tabindex 和 `data-scroll-*` 状态。 */
  viewportAttrs: ComputedRef<Record<string, string | number | undefined>>
  /** 视口的 overflow 和 overscroll。这几项归这个 composable 管，调用方不要再写。 */
  viewportStyle: ComputedRef<CSSProperties>
  state: ComputedRef<ScrollableAreaState>
}

function sameState(a: ScrollableAreaState, b: ScrollableAreaState): boolean {
  return axisStatesEqual(a.inline, b.inline) && axisStatesEqual(a.block, b.block)
}

/**
 * 对应原版 Astryx 的 `hooks/useScrollableArea`：可滚动容器系统的核心。
 *
 * 按逻辑轴（行内 / 块方向）给调用方的视口和内容加上滚动行为：
 * 只有内容真的溢出时视口才变成滚动容器；量出每条轴能不能滚、到没到两头；
 * 能滚时视口进入 Tab 顺序，让键盘也能滚；`overscroll: 'contain'` 只在真能滚的轴上生效。
 * 量出的状态登记到滚动归属表里，嵌套的滚动区域和键盘委托都靠它分清谁是哪一层。
 * 藏起来、没挂上或者尺寸为 0 的视口量不出来，保留上一次的结果，等下一次有效的信号。
 */
export function useScrollableArea(options: UseScrollableAreaOptions): UseScrollableAreaResult {
  const viewport = shallowRef<HTMLElement | null>(null)
  const content = ref<HTMLElement | null>(null)
  const measured = shallowRef<ScrollableAreaState>({ inline: INACTIVE_AXIS_STATE, block: INACTIVE_AXIS_STATE })
  const overflowInline = ref(false)
  const overflowBlock = ref(false)
  const mapping = shallowRef<LogicalAxisMapping>(DEFAULT_AXIS_MAPPING)
  const viewportHasFocus = ref(false)

  const axis = computed(() => options.axis ?? 'block')
  const overscroll = computed(() => options.overscroll ?? 'allow')
  const stickyContainment = computed(() => options.stickyContainment ?? 'whenScrollable')
  const keyboardAccess = computed<ScrollKeyboardAccess>(() =>
    options.keyboardAccess ?? { owner: 'viewport', label: options.label ?? '', role: options.role })

  function requested(name: 'inline' | 'block'): boolean {
    return axis.value === name || axis.value === 'both'
  }

  function measure(): void {
    const element = viewport.value
    if (element == null)
      return
    const style = getComputedStyle(element)
    if (!isMeasurable(element, style))
      return
    const nextMapping = getLogicalAxisMapping(style.writingMode, style.direction)
    const next: ScrollableAreaState = {
      inline: measureScrollAxis(element, 'inline', nextMapping, requested('inline'), style),
      block: measureScrollAxis(element, 'block', nextMapping, requested('block'), style),
    }
    registerScrollOwner(element, next)
    overflowInline.value = measureOverflow(element, 'inline', nextMapping)
    overflowBlock.value = measureOverflow(element, 'block', nextMapping)
    if (!mappingsEqual(mapping.value, nextMapping))
      mapping.value = nextMapping
    if (!sameState(measured.value, next))
      measured.value = next
  }

  let queued = false
  function queueMeasure(): void {
    if (queued)
      return
    queued = true
    queueMicrotask(() => {
      queued = false
      measure()
    })
  }

  function onViewportFocusIn(event: FocusEvent): void {
    viewportHasFocus.value = event.target === viewport.value
  }
  function onViewportFocusOut(): void {
    viewportHasFocus.value = false
  }

  function bind(element: unknown): void {
    const node = element instanceof HTMLElement ? element : null
    if (viewport.value === node)
      return
    const previous = viewport.value
    if (previous != null) {
      unregisterScrollOwner(previous)
      previous.removeEventListener('focusin', onViewportFocusIn)
      previous.removeEventListener('focusout', onViewportFocusOut)
    }
    viewport.value = node
    if (node == null)
      return
    registerScrollOwner(node, measured.value)
    node.addEventListener('focusin', onViewportFocusIn)
    node.addEventListener('focusout', onViewportFocusOut)
  }

  watch([viewport, content], ([element, inner], _previous, onCleanup) => {
    if (element == null || inner == null)
      return
    onCleanup(watchScrollInvalidation(element, inner, queueMeasure))
    queueMeasure()
  }, { immediate: true })

  watch(axis, queueMeasure)

  const state = computed<ScrollableAreaState>(() => ({
    inline: requested('inline') ? measured.value.inline : INACTIVE_AXIS_STATE,
    block: requested('block') ? measured.value.block : INACTIVE_AXIS_STATE,
  }))
  const scrollable = computed(() => state.value.inline.isScrollable || state.value.block.isScrollable)

  watch(
    [() => keyboardAccess.value.owner, scrollable, viewport, content],
    ([owner, isScrollable, element, inner], _previous, onCleanup) => {
      if (owner !== 'contentOrViewport' || !isScrollable || element == null || inner == null)
        return
      onCleanup(attachScrollKeyboardDelegation(element, inner))
    },
    { immediate: true },
  )

  onBeforeUnmount(() => bind(null))

  const viewportStyle = computed<CSSProperties>(() => {
    const map = mapping.value
    const onX = (name: 'inline' | 'block'): boolean => map[name] === 'x'
    const requestedX = (requested('inline') && onX('inline')) || (requested('block') && onX('block'))
    const requestedY = (requested('inline') && !onX('inline')) || (requested('block') && !onX('block'))
    const overflowingX = (overflowInline.value && onX('inline')) || (overflowBlock.value && onX('block'))
    const overflowingY = (overflowInline.value && !onX('inline')) || (overflowBlock.value && !onX('block'))
    const always = stickyContainment.value === 'always'
    const contains = overflowingX || overflowingY || always
    const scrollsX = always ? requestedX : overflowingX
    const scrollsY = always ? requestedY : overflowingY
    const style: CSSProperties = {
      overflowX: contains ? (scrollsX ? 'auto' : 'hidden') : 'clip',
      overflowY: contains ? (scrollsY ? 'auto' : 'hidden') : 'clip',
    }
    for (const name of ['inline', 'block'] as const) {
      if (!requested(name))
        continue
      const contain = overscroll.value === 'contain' && state.value[name].isScrollable
      style[onX(name) ? 'overscrollBehaviorX' : 'overscrollBehaviorY'] = contain ? 'contain' : 'auto'
    }
    return style
  })

  const viewportAttrs = computed(() => {
    const access = keyboardAccess.value
    const inline = state.value.inline
    const block = state.value.block
    const attrs: Record<string, string | number | undefined> = {
      'data-scroll-axis': axis.value,
      'data-scrollable-inline': inline.isScrollable ? 'true' : undefined,
      'data-scrollable-block': block.isScrollable ? 'true' : undefined,
      'data-scroll-inline-start': inline.atStart ? 'true' : undefined,
      'data-scroll-inline-end': inline.atEnd ? 'true' : undefined,
      'data-scroll-block-start': block.atStart ? 'true' : undefined,
      'data-scroll-block-end': block.atEnd ? 'true' : undefined,
    }
    if (access.owner === 'content')
      return attrs
    attrs.role = access.role ?? 'group'
    attrs['aria-label'] = access.label
    // 不能滚了但焦点还在视口上（程序放过来的），留 -1，焦点不会被扔回 body。
    attrs.tabindex = scrollable.value ? 0 : (viewportHasFocus.value ? -1 : undefined)
    return attrs
  })

  return { content, state, viewport: bind, viewportAttrs, viewportStyle }
}
