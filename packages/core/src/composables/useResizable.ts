import type { Ref } from 'vue'
import type { PixelWidth } from '../Table/types.js'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { registerResizableChannel } from './internal/resizableChannel.js'
import { loadPersistedState, savePersistedState } from './internal/resizableStorage.js'

export type ResizableDirection = 'horizontal' | 'vertical'

export interface ResizablePercentSize {
  type: 'percent'
  value: number
  min?: PixelWidth
  max?: PixelWidth
}

export type ResizableSize = number | `${number}px` | `${number}%` | PixelWidth | ResizablePercentSize

export interface ResizableRegionConfig {
  defaultSize?: ResizableSize | string
  minSize?: ResizableSize | string
  maxSize?: ResizableSize | string
  collapsible?: boolean
  collapsedSize?: number
  snaps?: number[]
  /** Cascade priority. A lower number gives up space first when the shared container is narrower than the regions. */
  shrinkOrder?: number
}

export interface UseResizableSingleOptions extends ResizableRegionConfig {
  containerRef?: Ref<HTMLElement | null>
  direction?: ResizableDirection
  autoSaveId?: string
  defaultIsCollapsed?: boolean
  isCollapsed?: boolean
  onSizeChange?: (size: number) => void
  onCollapseChange?: (isCollapsed: boolean) => void
}

export interface UseResizableMultiConfig {
  direction?: ResizableDirection
  containerRef?: Ref<HTMLElement | null>
  regions: Record<string, ResizableRegionConfig>
  autoSaveId?: string
}

export interface ResizableProps {
  _size: number
  _isCollapsed: boolean
  _onResizeStart: () => void
  _onResizeMove: (delta: number) => void
  _onResizeEnd: () => void
  _onResizeCancel?: () => void
  _minSizePx: number
  _maxSizePx: number
  _snaps: number[]
  _collapsedSize: number
  _collapsible: boolean
  _direction?: ResizableDirection
  _isResizableProps: true
}

export interface ResizableRegion {
  size: number
  isCollapsed: boolean
  collapse: () => void
  expand: () => void
  resize: (size: number) => void
  props: ResizableProps
}

interface CascadeApi {
  preferred: () => number
  isCollapsed: () => boolean
  min: () => number
  isDragging: () => boolean
  applyDisplay: (size: number) => void
}

interface CascadeLink {
  register: (api: CascadeApi) => void
  settle: () => void
}

const DEFAULT_SIZE = 250
const DEFAULT_MIN = 50
const DEFAULT_COLLAPSED_SIZE = 40
const UNMEASURED_BASIS = 1200

export function percent(
  value: number,
  options: { min: PixelWidth, max?: never } | { min?: never, max: PixelWidth },
): ResizablePercentSize {
  return { type: 'percent', value, ...options }
}

interface Basis {
  px: number
  measured: boolean
}

function readBasis(container: HTMLElement | null | undefined, direction: ResizableDirection): Basis {
  if (container) {
    const px = direction === 'horizontal' ? container.clientWidth : container.clientHeight
    if (px > 0)
      return { px, measured: true }
    return { px: UNMEASURED_BASIS, measured: false }
  }
  if (typeof window === 'undefined')
    return { px: UNMEASURED_BASIS, measured: false }
  const px = direction === 'horizontal' ? window.innerWidth : window.innerHeight
  return { px: px > 0 ? px : UNMEASURED_BASIS, measured: px > 0 }
}

function parseSize(value: ResizableSize | string | undefined, basis: number, fallback: number): number {
  if (value == null)
    return fallback
  if (typeof value === 'number')
    return value
  if (typeof value === 'string') {
    const text = value.trim()
    if (text.endsWith('%'))
      return (Number(text.slice(0, -1)) / 100) * basis
    if (text.endsWith('px'))
      return Number(text.slice(0, -2))
    const asNumber = Number(text)
    return Number.isFinite(asNumber) ? asNumber : fallback
  }
  if (value.type === 'pixel')
    return value.value
  const px = (value.value / 100) * basis
  if (value.min)
    return Math.max(px, value.min.value)
  if (value.max)
    return Math.min(px, value.max.value)
  return px
}

function clampSize(size: number, min: number, max: number, snaps: number[]): number {
  const clamped = Math.min(max, Math.max(min, size))
  if (snaps.length === 0)
    return clamped
  let nearest = snaps[0] ?? clamped
  let nearestDist = Math.abs(clamped - nearest)
  for (let index = 1; index < snaps.length; index += 1) {
    const snap = snaps[index] ?? nearest
    const dist = Math.abs(clamped - snap)
    if (dist < nearestDist) {
      nearest = snap
      nearestDist = dist
    }
  }
  return Math.min(max, Math.max(min, nearest))
}

function sizeDependsOnBasis(value: ResizableSize | string | undefined): boolean {
  if (typeof value === 'string')
    return value.trim().endsWith('%')
  return typeof value === 'object' && value != null && value.type === 'percent'
}

function contentBox(element: HTMLElement, direction: ResizableDirection): number | null {
  const style = getComputedStyle(element)
  const size = direction === 'vertical'
    ? element.clientHeight - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom)
    : element.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)
  return Number.isFinite(size) ? size : null
}

function useSingleRegion(options: UseResizableSingleOptions, cascade?: CascadeLink): ResizableRegion {
  const direction = options.direction ?? 'horizontal'
  const collapsible = options.collapsible ?? false
  const collapsedSize = options.collapsedSize ?? DEFAULT_COLLAPSED_SIZE
  const snaps = options.snaps ?? []
  const size = ref(DEFAULT_SIZE)
  const expandedSize = ref(DEFAULT_SIZE)
  const isCollapsed = ref(false)
  const basisMeasured = ref(true)
  const controlledCollapse = computed(() => options.isCollapsed)
  const clientExtent = ref<number | null>(null)
  let origin = DEFAULT_SIZE
  let settledDefault = false
  let dragging = false
  let dragLimits: { min: number, max: number } | null = null

  function observesContainer(): boolean {
    return options.containerRef != null && (
      sizeDependsOnBasis(options.minSize)
      || sizeDependsOnBasis(options.maxSize)
      || sizeDependsOnBasis(options.defaultSize)
    )
  }

  function reportedMax(min: number, max: number): number | undefined {
    if (Number.isFinite(max))
      return max
    let basis: number | null
    if (options.containerRef != null) {
      if (!sizeDependsOnBasis(options.minSize) && !sizeDependsOnBasis(options.maxSize))
        return undefined
      const element = options.containerRef.value
      basis = element == null ? null : contentBox(element, direction)
    }
    else {
      basis = clientExtent.value
    }
    if (basis == null || !(basis > 0))
      return undefined
    return Math.max(basis, isCollapsed.value ? min : size.value)
  }

  function currentBasis(): Basis {
    return readBasis(options.containerRef?.value, direction)
  }

  function limits(): { min: number, max: number } {
    const basis = currentBasis()
    basisMeasured.value = basis.measured || options.containerRef == null
    return {
      min: parseSize(options.minSize, basis.px, DEFAULT_MIN),
      max: parseSize(options.maxSize, basis.px, Number.POSITIVE_INFINITY),
    }
  }

  function applySize(next: number, collapsed: boolean): void {
    const { min, max } = limits()
    if (collapsed && collapsible) {
      isCollapsed.value = true
      size.value = 0
      return
    }
    const clamped = clampSize(next, min, max, snaps)
    isCollapsed.value = false
    size.value = clamped
    expandedSize.value = clamped
  }

  function restore(): void {
    const basis = currentBasis()
    const initial = parseSize(options.defaultSize, basis.px, DEFAULT_SIZE)
    const saved = options.autoSaveId ? loadPersistedState(options.autoSaveId) : null
    const collapsed = controlledCollapse.value ?? saved?.isCollapsed ?? (collapsible && options.defaultIsCollapsed === true)
    const starting = saved?.size ?? initial
    if (options.containerRef != null && !basis.measured) {
      basisMeasured.value = false
      applySize(starting, Boolean(collapsed))
      return
    }
    settledDefault = true
    basisMeasured.value = true
    expandedSize.value = starting
    applySize(starting, Boolean(collapsed))
  }

  restore()

  function persist(): void {
    if (!options.autoSaveId || !basisMeasured.value)
      return
    savePersistedState(options.autoSaveId, expandedSize.value, isCollapsed.value)
  }

  function setCollapsed(next: boolean): void {
    if (!collapsible && next)
      return
    if (options.isCollapsed != null) {
      options.onCollapseChange?.(next)
      return
    }
    applySize(next ? 0 : expandedSize.value, next)
    options.onCollapseChange?.(next)
    persist()
    cascade?.settle()
  }

  function resize(next: number): void {
    applySize(next, false)
    cascade?.settle()
    options.onSizeChange?.(size.value)
    persist()
  }

  function paintDrag(next: number, collapsed: boolean): void {
    const bounds = dragLimits ?? limits()
    if (collapsed && collapsible) {
      isCollapsed.value = true
      size.value = 0
      return
    }
    const clamped = clampSize(next, bounds.min, bounds.max, snaps)
    isCollapsed.value = false
    size.value = clamped
    expandedSize.value = clamped
  }

  function onResizeStart(): void {
    dragging = true
    origin = isCollapsed.value ? 0 : size.value
    dragLimits = limits()
  }

  function onResizeMove(delta: number): void {
    const raw = origin + delta
    if (collapsible && raw < collapsedSize) {
      if (!isCollapsed.value) {
        paintDrag(0, true)
        options.onCollapseChange?.(true)
        options.onSizeChange?.(0)
      }
      return
    }
    const wasCollapsed = isCollapsed.value
    paintDrag(raw, false)
    if (wasCollapsed)
      options.onCollapseChange?.(false)
    options.onSizeChange?.(size.value)
  }

  function onResizeEnd(): void {
    dragging = false
    dragLimits = null
    persist()
    cascade?.settle()
  }

  function applyDisplay(next: number): void {
    if (isCollapsed.value)
      return
    size.value = next
  }

  const props = computed<ResizableProps>(() => {
    const { min, max } = limits()
    const value: ResizableProps = {
      _size: size.value,
      _isCollapsed: isCollapsed.value,
      _onResizeStart: onResizeStart,
      _onResizeMove: onResizeMove,
      _onResizeEnd: onResizeEnd,
      _onResizeCancel: onResizeEnd,
      _minSizePx: min,
      _maxSizePx: max,
      _snaps: snaps,
      _collapsedSize: collapsedSize,
      _collapsible: collapsible,
      _direction: direction,
      _isResizableProps: true,
    }
    registerResizableChannel(value, {
      collapse: () => setCollapsed(true),
      expand: () => setCollapsed(false),
    }, reportedMax(min, max))
    return value
  })

  function measureDefault(): void {
    if (settledDefault || options.containerRef == null)
      return
    const basis = currentBasis()
    if (!basis.measured)
      return
    settledDefault = true
    basisMeasured.value = true
    if (options.autoSaveId && loadPersistedState(options.autoSaveId))
      return
    const initial = parseSize(options.defaultSize, basis.px, size.value)
    expandedSize.value = initial
    if (!isCollapsed.value)
      applySize(initial, false)
    cascade?.settle()
  }

  let observer: ResizeObserver | undefined
  onMounted(() => {
    if (options.containerRef == null && typeof window !== 'undefined')
      clientExtent.value = direction === 'vertical' ? window.innerHeight : window.innerWidth
    measureDefault()
    const element = options.containerRef?.value
    if (element == null || typeof ResizeObserver === 'undefined' || !observesContainer())
      return
    observer = new ResizeObserver(() => measureDefault())
    observer.observe(element)
  })
  onBeforeUnmount(() => observer?.disconnect())

  watch(controlledCollapse, (next) => {
    if (next != null) {
      applySize(next ? 0 : expandedSize.value, next)
      cascade?.settle()
    }
  })

  cascade?.register({
    preferred: () => expandedSize.value,
    isCollapsed: () => isCollapsed.value,
    min: () => limits().min,
    isDragging: () => dragging,
    applyDisplay,
  })

  return reactive({
    size,
    isCollapsed,
    collapse: () => setCollapsed(true),
    expand: () => setCollapsed(false),
    resize,
    props,
  })
}

export function useResizable(options: UseResizableMultiConfig): Record<string, ResizableRegion>
export function useResizable(options: UseResizableSingleOptions): ResizableRegion
export function useResizable(options: UseResizableSingleOptions | UseResizableMultiConfig): ResizableRegion | Record<string, ResizableRegion> {
  if ('regions' in options && options.regions != null) {
    const direction = options.direction ?? 'horizontal'
    const entries: { key: string, order: number | undefined, api: CascadeApi }[] = []
    let ready = false

    function reflow(): void {
      if (!ready || entries.length === 0 || !entries.some(entry => entry.order != null))
        return
      if (entries.some(entry => entry.api.isDragging()))
        return
      const element = options.containerRef?.value
      if (element == null)
        return
      const basis = readBasis(element, direction)
      if (!basis.measured)
        return
      const active = entries.filter(entry => !entry.api.isCollapsed())
      const sizes = new Map(active.map(entry => [entry.key, entry.api.preferred()]))
      let overflow = active.reduce((sum, entry) => sum + entry.api.preferred(), 0) - basis.px
      if (overflow > 0) {
        const order = [...active].sort((left, right) => {
          const leftOrder = left.order ?? Number.POSITIVE_INFINITY
          const rightOrder = right.order ?? Number.POSITIVE_INFINITY
          return leftOrder - rightOrder || entries.indexOf(left) - entries.indexOf(right)
        })
        for (const entry of order) {
          if (overflow <= 0)
            break
          const current = sizes.get(entry.key) ?? 0
          const room = Math.max(0, current - entry.api.min())
          const take = Math.min(room, overflow)
          sizes.set(entry.key, current - take)
          overflow -= take
        }
      }
      for (const entry of active) {
        const next = sizes.get(entry.key)
        if (next != null)
          entry.api.applyDisplay(next)
      }
    }

    const regions: Record<string, ResizableRegion> = {}
    for (const key of Object.keys(options.regions)) {
      const config = options.regions[key]
      regions[key] = useSingleRegion({
        ...config,
        direction,
        containerRef: options.containerRef,
        autoSaveId: options.autoSaveId ? `${options.autoSaveId}:${key}` : undefined,
      }, {
        register: (api) => {
          entries.push({ key, order: config?.shrinkOrder, api })
        },
        settle: reflow,
      })
    }
    ready = true

    let observer: ResizeObserver | undefined
    onMounted(() => {
      reflow()
      const element = options.containerRef?.value
      if (element == null || typeof ResizeObserver === 'undefined')
        return
      observer = new ResizeObserver(() => reflow())
      observer.observe(element)
    })
    onBeforeUnmount(() => observer?.disconnect())
    return regions
  }
  return useSingleRegion(options)
}

export type UseResizableOptions = UseResizableSingleOptions | UseResizableMultiConfig
export type ResizableState = ResizableRegion
