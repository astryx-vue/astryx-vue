import type { Ref } from 'vue'
import type { PixelWidth } from '../Table/types.js'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

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

const DEFAULT_SIZE = 250
const DEFAULT_MIN = 50
const DEFAULT_COLLAPSED_SIZE = 40
const UNMEASURED_BASIS = 1200
const STORAGE_PREFIX = 'astryx-resizable:'

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

interface PersistedResizableState {
  size: number | null
  isCollapsed: boolean | null
}

function loadPersistedState(key: string): PersistedResizableState | null {
  if (typeof window === 'undefined')
    return null
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw == null)
      return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'number' && Number.isFinite(parsed)) {
      return parsed === 0
        ? { size: null, isCollapsed: true }
        : { size: parsed, isCollapsed: null }
    }
    if (typeof parsed === 'object' && parsed != null) {
      const record = parsed as { size?: unknown, isCollapsed?: unknown }
      const hasSize = typeof record.size === 'number' && Number.isFinite(record.size) && record.size > 0
      if (hasSize || record.isCollapsed === true) {
        return {
          size: hasSize ? record.size as number : null,
          isCollapsed: record.isCollapsed === true,
        }
      }
    }
  }
  catch {
    return null
  }
  return null
}

function useSingleRegion(options: UseResizableSingleOptions): ResizableRegion {
  const direction = options.direction ?? 'horizontal'
  const collapsible = options.collapsible ?? false
  const collapsedSize = options.collapsedSize ?? DEFAULT_COLLAPSED_SIZE
  const snaps = options.snaps ?? []
  const size = ref(DEFAULT_SIZE)
  const expandedSize = ref(DEFAULT_SIZE)
  const isCollapsed = ref(false)
  const basisMeasured = ref(true)
  const controlledCollapse = computed(() => options.isCollapsed)
  let origin = DEFAULT_SIZE
  let settledDefault = false

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
    try {
      localStorage.setItem(STORAGE_PREFIX + options.autoSaveId, JSON.stringify({
        size: expandedSize.value,
        isCollapsed: isCollapsed.value,
      }))
    }
    catch {
      /* ignore */
    }
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
  }

  function resize(next: number): void {
    applySize(next, false)
    options.onSizeChange?.(size.value)
    persist()
  }

  function onResizeStart(): void {
    origin = isCollapsed.value ? 0 : size.value
  }

  function onResizeMove(delta: number): void {
    const raw = origin + delta
    if (collapsible && raw < collapsedSize) {
      setCollapsed(true)
      return
    }
    applySize(raw, false)
    options.onSizeChange?.(size.value)
  }

  function onResizeEnd(): void {
    persist()
  }

  const props = computed<ResizableProps>(() => {
    const { min, max } = limits()
    return {
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
  }

  let observer: ResizeObserver | undefined
  onMounted(() => {
    measureDefault()
    const element = options.containerRef?.value
    if (element == null || typeof ResizeObserver === 'undefined')
      return
    observer = new ResizeObserver(() => measureDefault())
    observer.observe(element)
  })
  onBeforeUnmount(() => observer?.disconnect())

  watch(controlledCollapse, (next) => {
    if (next != null)
      applySize(next ? 0 : expandedSize.value, next)
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
    const regions: Record<string, ResizableRegion> = {}
    for (const key of Object.keys(options.regions)) {
      regions[key] = useSingleRegion({
        ...options.regions[key],
        direction: options.direction,
        containerRef: options.containerRef,
        autoSaveId: options.autoSaveId ? `${options.autoSaveId}:${key}` : undefined,
      })
    }
    return regions
  }
  return useSingleRegion(options)
}

export type UseResizableOptions = UseResizableSingleOptions | UseResizableMultiConfig
export type ResizableState = ResizableRegion
