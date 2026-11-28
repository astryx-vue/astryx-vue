/**
 * ChatVirtualizer 的 Vue 接线：数据变化的分类、要渲染的行、每次渲染后的修正轮和
 * 历史行的 aria-busy、焦点行的保留、滚动容器的接入和手指滚动的交接。
 * 几何、测量、修正轮和滚动判断各在 chatVirtualizer*.ts 里。
 */
import type { ComputedRef } from 'vue'
import type { RowEntry } from './chatVirtualizerRows.js'
import type { VirtualizerHost } from './chatVirtualizerState.js'
import type { ChatVirtualizerExpose, ChatVirtualizerProps, RowWindow } from './chatVirtualizerTypes.js'
import { scrollEventTarget, useFingerScroll } from '@astryx-vue/core'
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, watch } from 'vue'
import { attachScroller, createSizeObserver } from './chatVirtualizerAttach.js'
import { EMPTY_WINDOW } from './chatVirtualizerGeometry.js'
import { createVirtualizerPass } from './chatVirtualizerPass.js'
import { classifyDataChange, mountsHistory, nextArrivals, planRows } from './chatVirtualizerRows.js'
import { createScrollHandler } from './chatVirtualizerScroll.js'
import { createRowSizes } from './chatVirtualizerSizes.js'
import { cancelFrame, createVirtualizerState } from './chatVirtualizerState.js'

type GapName = 'gapTop' | 'gapBottom' | 'gapTail'

export const CHAT_VIRTUALIZER_DEFAULTS = {
  estimatedItemSize: 120,
  endThreshold: 24,
  overscanTop: 1600,
  overscanBottom: 600,
} as const

type ElRef = (el: unknown) => void

export interface UseChatVirtualizerReturn {
  isAttach: ComputedRef<boolean>
  entries: ComputedRef<RowEntry[]>
  bindOwnScroller: ElRef
  bindContent: ElRef
  bindTop: ElRef
  bindBottom: ElRef
  gapRefs: Record<GapName, ElRef>
  rowRef: (key: string) => ElRef
  onFocusIn: (event: FocusEvent) => void
  onFocusOut: (event: FocusEvent) => void
  expose: ChatVirtualizerExpose
}

export function useChatVirtualizer<T>(props: ChatVirtualizerProps<T>): UseChatVirtualizerReturn {
  const state = createVirtualizerState()
  const sizes = createRowSizes<T>()
  const ownScroller = shallowRef<HTMLElement | null>(null)
  const win = shallowRef<RowWindow>(EMPTY_WINDOW)
  const focusedKey = ref<string | null>(null)
  const arrived = shallowRef<ReadonlySet<string>>(new Set())
  const rowEls = new Map<string, HTMLElement>()
  const els = { content: null, top: null, bottom: null, gapTop: null, gapBottom: null, gapTail: null } as VirtualizerHost<T>['els']

  /** 不传是自带容器；传 null 是挂载模式在等元素，这时什么都不做，也不退回自带容器。 */
  const isAttach = computed(() => props.scrollElement !== undefined)
  const scroller = computed(() => isAttach.value ? (props.scrollElement ?? null) : ownScroller.value)
  const keys = computed(() => props.data.map((item, i) => String(props.getRowKey(item, i))))
  const plan = computed(() => planRows(keys.value, win.value, focusedKey.value, arrived.value))

  // 和 DOM 对得上的那一次渲染：修正轮读它，而不是还没渲染出来的新窗口。
  let committed = { win: EMPTY_WINDOW, pinnedKey: null as string | null, tailKey: null as string | null }
  let newsKeys = new Set<string>()
  let committedKeys: ReadonlySet<string> = new Set()
  let arrivalKeys: readonly string[] | null = null
  let lastPass: { keys: string, scroller: HTMLElement | null, sizing: readonly unknown[] } | null = null
  let busyFrame: number | null = null

  // 手指滚动的读数要先于 host 建好；松手时的交接等修正轮建好后再接上。
  let onGestureEnd = (): void => {}
  const isFingerScroll = useFingerScroll(
    () => (scroller.value == null ? null : scrollEventTarget(scroller.value)),
    { onEnd: () => onGestureEnd() },
  )

  const host: VirtualizerHost<T> = {
    getScroller: () => scroller.value,
    hasHostScroller: () => props.scrollElement != null,
    getData: () => props.data,
    getKeys: () => keys.value,
    getEstimatedItemSize: () => props.estimatedItemSize ?? CHAT_VIRTUALIZER_DEFAULTS.estimatedItemSize,
    getItemType: () => props.getItemType,
    getOverscan: () => ({
      top: props.overscanTop ?? CHAT_VIRTUALIZER_DEFAULTS.overscanTop,
      bottom: props.overscanBottom ?? CHAT_VIRTUALIZER_DEFAULTS.overscanBottom,
    }),
    getEndThreshold: () => props.endThreshold ?? CHAT_VIRTUALIZER_DEFAULTS.endThreshold,
    getWin: () => committed.win,
    setWin: (next) => {
      win.value = next
    },
    getPinnedKey: () => committed.pinnedKey,
    getTailKey: () => committed.tailKey,
    isFingerScroll,
    els,
    rowEls,
    sizes,
  }
  const pass = createVirtualizerPass(state, host)
  const onScroll = createScrollHandler(state, host, pass)
  const sizeObserver = createSizeObserver(state, host, pass.sync)
  onGestureEnd = pass.flushGesture

  // 数据变了：几何作废；分出哪些是新消息；第一行换了就是往上加载了历史，按收敛处理，
  // 免得半路的位置被当成新的参照。
  watch(keys, (next) => {
    state.geoChanged = true
    const change = classifyDataChange(state.geo.index, state.geo.keys[0], next)
    newsKeys = change.news
    if (change.headChanged) {
      state.converging = true
      state.priceFreeze = true
    }
    arrived.value = nextArrivals(arrivalKeys, next, win.value, arrived.value)
    arrivalKeys = next
  }, { flush: 'sync' })
  watch(win, (next) => {
    arrived.value = nextArrivals(null, keys.value, next, arrived.value)
  }, { flush: 'sync' })

  watch(scroller, (el, _previous, onCleanup) => {
    if (el)
      onCleanup(attachScroller(el, state, onScroll, sizeObserver))
  }, { immediate: true, flush: 'post' })

  function markBusy(): void {
    const block = els.content
    if (block === null)
      return
    block.setAttribute('aria-busy', 'true')
    if (busyFrame !== null)
      cancelAnimationFrame(busyFrame)
    busyFrame = requestAnimationFrame(() => {
      busyFrame = requestAnimationFrame(() => {
        busyFrame = null
        block.removeAttribute('aria-busy')
      })
    })
  }

  function afterRender(): void {
    const current = plan.value
    committed = { win: win.value, pinnedKey: current.pinnedKey, tailKey: current.tailKey }
    const rendered: string[] = []
    for (const entry of current.entries) {
      if (entry.kind !== 'row')
        continue
      rendered.push(entry.key)
      if (props.getItemType)
        sizes.noteType(entry.key, props.getItemType(props.data[entry.index], entry.index))
    }
    const isBusy = mountsHistory(rendered, committedKeys, newsKeys)
    // 一次渲染什么都没改（父组件用同样的行重渲染）就跳过修正轮。
    const signature = rendered.join('\n')
    const sizing = [props.overscanTop, props.overscanBottom, props.estimatedItemSize, props.getItemType]
    const el = scroller.value
    const unchanged = !state.geoChanged && lastPass !== null && lastPass.keys === signature
      && lastPass.scroller === el && lastPass.sizing.every((value, i) => Object.is(value, sizing[i]))
    if (!unchanged) {
      lastPass = { keys: signature, scroller: el, sizing }
      pass.sync()
    }
    // 新消息只算一次：挂过一次就是历史了。
    for (const key of rendered)
      newsKeys.delete(key)
    committedKeys = new Set(rendered)
    if (isBusy)
      markBusy()
  }
  onMounted(afterRender)
  onUpdated(afterRender)

  onBeforeUnmount(() => {
    sizeObserver.dispose()
    for (const name of ['retry', 'release', 'restore', 'flush'] as const)
      cancelFrame(state, name)
    if (busyFrame !== null)
      cancelAnimationFrame(busyFrame)
  })

  const rowRefs = new Map<string, (el: unknown) => void>()
  /** 每个身份一个稳定的回调，免得每次渲染都重新挂上观察。 */
  function rowRef(key: string): (el: unknown) => void {
    let cb = rowRefs.get(key)
    if (!cb) {
      cb = (el) => {
        if (el instanceof HTMLElement) {
          rowEls.set(key, el)
          sizeObserver.observe(el)
          return
        }
        const prev = rowEls.get(key)
        if (prev)
          sizeObserver.unobserve(prev)
        rowEls.delete(key)
        rowRefs.delete(key)
      }
      rowRefs.set(key, cb)
    }
    return cb
  }
  const bindEl = (name: keyof typeof els) => (el: unknown) => {
    els[name] = el instanceof HTMLElement ? el : null
  }
  const gapRefs: Record<GapName, (el: unknown) => void> = {
    gapTop: bindEl('gapTop'),
    gapBottom: bindEl('gapBottom'),
    gapTail: bindEl('gapTail'),
  }

  // 拿着焦点的行即使被窗口甩开也留着，键盘用户的焦点不会掉到页面上。
  function onFocusIn(event: FocusEvent): void {
    const block = event.currentTarget as HTMLElement
    const row = (event.target as Element | null)?.closest<HTMLElement>('[data-pkey]')
    focusedKey.value = row != null && block.contains(row) ? (row.dataset.pkey ?? null) : null
  }
  function onFocusOut(event: FocusEvent): void {
    const block = event.currentTarget as HTMLElement
    const next = event.relatedTarget as Node | null
    if (next != null) {
      if (!block.contains(next))
        focusedKey.value = null
      return
    }
    // 没有下一个焦点目标的失焦也可能发生在窗口切换时，焦点真离开列表才放掉。
    queueMicrotask(() => {
      if (!block.contains(block.ownerDocument.activeElement))
        focusedKey.value = null
    })
  }

  const expose: ChatVirtualizerExpose = {
    scrollToDistanceFromBottomPx: (px = 0) => pass.declare({ kind: 'end', distance: px }),
    anchorToKey: (key, viewportOffset = 0) => pass.declare({ kind: 'anchor', key: String(key), viewportOffset }),
  }

  return {
    isAttach,
    entries: computed<RowEntry[]>(() => plan.value.entries),
    bindOwnScroller: (el: unknown) => {
      ownScroller.value = el instanceof HTMLElement ? el : null
    },
    bindContent: bindEl('content'),
    bindTop: bindEl('top'),
    bindBottom: bindEl('bottom'),
    gapRefs,
    rowRef,
    onFocusIn,
    onFocusOut,
    expose,
  }
}
