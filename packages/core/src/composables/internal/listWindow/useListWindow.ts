import type { ComputedRef } from 'vue'
import type { ListWindowKey, ListWindowPlan, ListWindowSegment } from './listWindow.js'
import type { ListWindowGeometry } from './listWindowGeometry.js'
import { computed, shallowRef, watch } from 'vue'
import { calculateListWindow, createListWindowSegments, isPositiveFinite, reconcileListAnchor } from './listWindow.js'
import { useListFocusIsland } from './useListFocusIsland.js'

/** 定高行的行高，和量到视口之前用来规划首帧的视口高度。 */
export interface ListWindowPitch {
  readonly rowHeight: number
  readonly viewportHeight: number
}

export interface UseListWindowOptions {
  /** 每项一个稳定的键，按顺序。 */
  keys: () => readonly ListWindowKey[]
  /** 键到位置的映射，键变了才重建。 */
  keyIndices: () => ReadonlyMap<ListWindowKey, number>
  /** 没有合法行高时为 `undefined`。 */
  pitch: () => ListWindowPitch | undefined
  /** 现在是否窗口化：调用方已经放行，也没有被退回全部渲染。 */
  canWindow: () => boolean
  geometry: () => ListWindowGeometry
  /** 滚动视口：锚点要写回滚动位置，删掉焦点项时焦点也落在这里。 */
  viewport: () => HTMLElement | null
}

export interface ListWindowResult {
  segments: ComputedRef<ListWindowSegment[]>
  plan: ComputedRef<ListWindowPlan | null>
  isWindowed: ComputedRef<boolean>
  onItemFocus: (key: ListWindowKey) => void
  onItemBlur: () => void
}

interface RenderedWindow {
  keys: readonly ListWindowKey[]
  pitch: ListWindowPitch
  plan: ListWindowPlan
  geometry: ListWindowGeometry
}

/** 数据变化后还没落到视口上的锚点滚动：`from` 是那时视口的位置。 */
interface PendingAnchor {
  from: number
  to: number
}

/**
 * 块方向的长列表窗口：定高行，算出要挂载的段和占位段；保留一个焦点岛；
 * 数据或行高变了，按第一行可见行的键把它留在原处。不装任何观察器，几何由调用方提供。
 */
export function useListWindow(options: UseListWindowOptions): ListWindowResult {
  const pending = shallowRef<PendingAnchor | undefined>()
  let rendered: RenderedWindow | undefined
  const island = useListFocusIsland({
    keyIndices: options.keyIndices,
    isActive: options.canWindow,
    viewport: options.viewport,
  })

  const effectiveGeometry = computed<ListWindowGeometry>(() => {
    const snapshot = options.geometry()
    const pitch = options.pitch()
    const isUsable = snapshot.isMeasured
      && isPositiveFinite(snapshot.viewportHeight)
      && Number.isFinite(snapshot.scrollTop)
      && Number.isFinite(snapshot.startOffset)
    if (isUsable)
      return snapshot
    return { ...snapshot, viewportHeight: pitch?.viewportHeight ?? 0, scrollTop: 0, startOffset: 0, isMeasured: false }
  })

  const plan = computed<ListWindowPlan | null>(() => {
    const pitch = options.pitch()
    if (!options.canWindow() || pitch == null)
      return null
    const geometry = effectiveGeometry.value
    return calculateListWindow({
      rowCount: options.keys().length,
      rowHeight: pitch.rowHeight,
      viewportHeight: geometry.viewportHeight,
      scrollTop: pending.value?.to ?? geometry.scrollTop,
      scrollHeight: geometry.isMeasured ? geometry.scrollHeight : undefined,
      startOffset: geometry.startOffset,
      isMeasured: geometry.isMeasured,
    })
  })

  const isWindowed = computed(() => plan.value !== null)
  const range = computed(() => ({ start: plan.value?.start ?? 0, end: plan.value?.end ?? options.keys().length }))
  const segments = computed<ListWindowSegment[]>(() => {
    const count = options.keys().length
    if (!isWindowed.value)
      return count === 0 ? [] : [{ type: 'rows', start: 0, end: count }]
    return createListWindowSegments(count, options.pitch()?.rowHeight ?? 0, range.value.start, range.value.end, island.focusIndex.value)
  })

  // 数据或行高变了：在渲染之前按上一次渲染的第一行可见行算出新位置，这一帧就画对。
  watch([options.keys, options.pitch], ([keys, pitch]) => {
    const last = rendered
    if (!options.canWindow() || pitch == null || last == null)
      return
    const geometry = effectiveGeometry.value
    if (!geometry.isMeasured)
      return
    // 行前内容里的负距离不按行高缩放。
    const offset = last.plan.offset < 0 ? last.plan.offset : (last.plan.offset / last.pitch.rowHeight) * pitch.rowHeight
    const to = reconcileListAnchor({
      previousKeys: last.keys,
      keys,
      keyIndices: options.keyIndices(),
      firstVisibleIndex: last.plan.firstVisibleIndex,
      offset,
      rowHeight: pitch.rowHeight,
      viewportHeight: geometry.viewportHeight,
      startOffset: geometry.startOffset,
      trailingContentHeight: Math.max(0, last.geometry.scrollHeight - last.geometry.startOffset - last.plan.totalHeight),
    })
    pending.value = Math.abs(to - geometry.scrollTop) > 0.5 ? { from: geometry.scrollTop, to } : undefined
  })

  // 视口自己滚动了（锚点落地，或者用户又滚了），锚点就不再需要。
  watch(() => options.geometry().scrollTop, (scrollTop) => {
    if (pending.value != null && scrollTop !== pending.value.from)
      pending.value = undefined
  })

  // 渲染之后：记下这一帧，再把还没落地的锚点写到视口上。
  watch([plan, effectiveGeometry, options.keys], ([current, geometry]) => {
    const pitch = options.pitch()
    rendered = current != null && pitch != null && geometry.isMeasured
      ? { keys: options.keys(), pitch, plan: current, geometry }
      : undefined
    const anchor = pending.value
    const viewport = options.viewport()
    if (anchor == null || viewport == null)
      return
    viewport.scrollTop = anchor.to
    // 浏览器夹住了位置、没有发出滚动：按视口现在的位置算。
    if (Math.abs(viewport.scrollTop - anchor.from) < 0.5)
      pending.value = undefined
  }, { flush: 'post', immediate: true })

  return {
    segments,
    plan,
    isWindowed,
    onItemFocus: island.onItemFocus,
    onItemBlur: island.onItemBlur,
  }
}
