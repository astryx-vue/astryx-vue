import type { ComputedRef, CSSProperties, Ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type ScrollAxis = 'inline' | 'block' | 'both'
export type ScrollOverscroll = 'allow' | 'contain'
export type ScrollStickyContainment = 'whenScrollable' | 'always'
export type ScrollRole = 'group' | 'region'

export interface ScrollAxisState {
  isScrollable: boolean
  atStart: boolean
  atEnd: boolean
}

export interface ScrollableAreaState {
  inline: ScrollAxisState
  block: ScrollAxisState
}

export interface UseScrollableAreaOptions {
  axis?: ScrollAxis
  label: string
  role?: ScrollRole
  overscroll?: ScrollOverscroll
  stickyContainment?: ScrollStickyContainment
}

const TOLERANCE = 1
const idleAxis = (): ScrollAxisState => ({ isScrollable: false, atStart: true, atEnd: true })

interface Mapping {
  inline: 'x' | 'y'
  block: 'x' | 'y'
  inlineReversed: boolean
  blockReversed: boolean
}

function mappingFor(element: HTMLElement): Mapping {
  const style = getComputedStyle(element)
  const mode = style.writingMode.toLowerCase()
  const vertical = mode.startsWith('vertical') || mode.startsWith('sideways')
  const rtl = style.direction === 'rtl'
  if (!vertical) {
    return { inline: 'x', block: 'y', inlineReversed: rtl, blockReversed: false }
  }
  return {
    inline: 'y',
    block: 'x',
    inlineReversed: mode === 'sideways-lr' ? !rtl : rtl,
    blockReversed: mode.endsWith('-rl'),
  }
}

function extent(element: HTMLElement, axis: 'x' | 'y'): { client: number, content: number, offset: number } {
  if (axis === 'x')
    return { client: element.clientWidth, content: element.scrollWidth, offset: element.scrollLeft }
  return { client: element.clientHeight, content: element.scrollHeight, offset: element.scrollTop }
}

export function useScrollableArea(options: UseScrollableAreaOptions): UseScrollableAreaResult {
  const viewport = ref<HTMLElement | null>(null)
  const content = ref<HTMLElement | null>(null)
  const inline = ref<ScrollAxisState>(idleAxis())
  const block = ref<ScrollAxisState>(idleAxis())
  const overflowInline = ref(false)
  const overflowBlock = ref(false)
  const mapping = ref<Mapping>({ inline: 'x', block: 'y', inlineReversed: false, blockReversed: false })
  let observer: ResizeObserver | undefined

  const axis = computed(() => options.axis ?? 'block')
  const overscroll = computed(() => options.overscroll ?? 'allow')
  const stickyContainment = computed(() => options.stickyContainment ?? 'whenScrollable')

  function requested(name: 'inline' | 'block'): boolean {
    return axis.value === name || axis.value === 'both'
  }

  function sameAxis(current: ScrollAxisState, next: ScrollAxisState): boolean {
    return current.isScrollable === next.isScrollable && current.atStart === next.atStart && current.atEnd === next.atEnd
  }

  function measure(): void {
    const element = viewport.value
    if (element == null)
      return
    const nextMapping = mappingFor(element)
    const read = (name: 'inline' | 'block', reversed: boolean): { overflowing: boolean, state: ScrollAxisState } => {
      const box = extent(element, nextMapping[name])
      const overflowing = box.content > box.client + TOLERANCE
      const max = Math.max(0, box.content - box.client)
      const offset = reversed ? max - Math.abs(box.offset) : Math.abs(box.offset)
      const active = requested(name) && overflowing
      return {
        overflowing,
        state: {
          isScrollable: active,
          atStart: !active || offset <= TOLERANCE,
          atEnd: !active || offset >= max - TOLERANCE,
        } satisfies ScrollAxisState,
      }
    }
    const inlineRead = read('inline', nextMapping.inlineReversed)
    const blockRead = read('block', nextMapping.blockReversed)
    const nextInline = requested('inline') ? inlineRead.state : idleAxis()
    const nextBlock = requested('block') ? blockRead.state : idleAxis()
    if (
      mapping.value.inline === nextMapping.inline
      && mapping.value.block === nextMapping.block
      && mapping.value.inlineReversed === nextMapping.inlineReversed
      && mapping.value.blockReversed === nextMapping.blockReversed
      && overflowInline.value === inlineRead.overflowing
      && overflowBlock.value === blockRead.overflowing
      && sameAxis(inline.value, nextInline)
      && sameAxis(block.value, nextBlock)
    ) {
      return
    }
    mapping.value = nextMapping
    overflowInline.value = inlineRead.overflowing
    overflowBlock.value = blockRead.overflowing
    inline.value = nextInline
    block.value = nextBlock
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

  function bind(element: unknown): void {
    const node = element instanceof HTMLElement ? element : null
    if (viewport.value === node)
      return
    viewport.value?.removeEventListener('scroll', measure)
    observer?.disconnect()
    observer = undefined
    viewport.value = node
    if (node == null)
      return
    node.addEventListener('scroll', measure, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => queueMeasure())
      observer.observe(node)
      if (content.value)
        observer.observe(content.value)
    }
    queueMeasure()
  }

  watch(content, (element) => {
    if (element && observer)
      observer.observe(element)
    queueMeasure()
  })

  watch([axis, overscroll, stickyContainment], queueMeasure)

  onMounted(queueMeasure)
  onBeforeUnmount(() => {
    viewport.value?.removeEventListener('scroll', measure)
    observer?.disconnect()
  })

  const viewportStyle = computed<CSSProperties>(() => {
    const map = mapping.value
    const requestedX = (requested('inline') && map.inline === 'x') || (requested('block') && map.block === 'x')
    const requestedY = (requested('inline') && map.inline === 'y') || (requested('block') && map.block === 'y')
    const overflowingX = (overflowInline.value && map.inline === 'x') || (overflowBlock.value && map.block === 'x')
    const overflowingY = (overflowInline.value && map.inline === 'y') || (overflowBlock.value && map.block === 'y')
    const contains = overflowingX || overflowingY || stickyContainment.value === 'always'
    const scrollsX = stickyContainment.value === 'always' ? requestedX : overflowingX
    const scrollsY = stickyContainment.value === 'always' ? requestedY : overflowingY
    const style: CSSProperties = {
      overflowX: contains ? (scrollsX ? 'auto' : 'hidden') : 'clip',
      overflowY: contains ? (scrollsY ? 'auto' : 'hidden') : 'clip',
    }
    if (requested('inline'))
      style[map.inline === 'x' ? 'overscrollBehaviorX' : 'overscrollBehaviorY'] = overscroll.value === 'contain' && inline.value.isScrollable ? 'contain' : 'auto'
    if (requested('block'))
      style[map.block === 'x' ? 'overscrollBehaviorX' : 'overscrollBehaviorY'] = overscroll.value === 'contain' && block.value.isScrollable ? 'contain' : 'auto'
    return style
  })

  const scrollable = computed(() => inline.value.isScrollable || block.value.isScrollable)

  const viewportAttrs = computed(() => ({
    'role': options.role ?? 'group',
    'aria-label': options.label,
    'tabindex': scrollable.value ? 0 : undefined,
    'data-scroll-axis': axis.value,
    'data-scrollable-inline': inline.value.isScrollable ? 'true' : undefined,
    'data-scrollable-block': block.value.isScrollable ? 'true' : undefined,
    'data-scroll-inline-start': inline.value.atStart ? 'true' : undefined,
    'data-scroll-inline-end': inline.value.atEnd ? 'true' : undefined,
    'data-scroll-block-start': block.value.atStart ? 'true' : undefined,
    'data-scroll-block-end': block.value.atEnd ? 'true' : undefined,
  }))

  return {
    viewport: bind,
    content,
    viewportAttrs,
    viewportStyle,
    state: computed<ScrollableAreaState>(() => ({ inline: inline.value, block: block.value })),
  }
}

export interface UseScrollableAreaResult {
  viewport: (element: unknown) => void
  content: Ref<HTMLElement | null>
  viewportAttrs: ComputedRef<Record<string, string | number | undefined>>
  viewportStyle: ComputedRef<CSSProperties>
  state: ComputedRef<ScrollableAreaState>
}
