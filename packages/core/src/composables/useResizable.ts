import type { Ref } from 'vue'
import type { PixelWidth } from '../Table/types.js'
import type { Basis } from './internal/resizableSize.js'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { createRegionMotion } from '../Resizable/regionMotion.js'
import { registerPropsRegion } from '../Resizable/resizablePane.js'
import { registerResizableChannel, resizeHandleBeside } from './internal/resizableChannel.js'
import { clampSize, contentBox, parseSize, readBasis, sizeDependsOnBasis } from './internal/resizableSize.js'
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

export { percent } from './internal/resizableSize.js'
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

  const motion = createRegionMotion({
    isCollapsed: () => isCollapsed.value,
    size: () => size.value,
    limits: () => limits(),
    collapsible,
    collapsedSize,
    handleOf: pane => resizeHandleBeside(pane.element, pane.contentFacingEdge() === 'inline-start' ? 'end' : 'start'),
    paint(raw, useSnaps) {
      const wasCollapsed = isCollapsed.value
      // 受控时拖开收起的区域只报告，由调用方决定展开；展开后用拖到的尺寸。
      if (wasCollapsed && options.isCollapsed != null) {
        const bounds = dragLimits ?? limits()
        expandedSize.value = clampSize(raw, bounds.min, bounds.max, useSnaps ? snaps : [])
        options.onCollapseChange?.(false)
        return expandedSize.value
      }
      applySize(raw, false, dragLimits ?? limits(), useSnaps)
      if (wasCollapsed)
        options.onCollapseChange?.(false)
      options.onSizeChange?.(size.value)
      return size.value
    },
    close(expandTo) {
      if (expandTo != null)
        expandedSize.value = expandTo
      setCollapsed(true)
      options.onSizeChange?.(0)
    },
    endGesture() {
      dragging = false
      dragLimits = null
      persist()
      cascade?.settle()
    },
  })

  function commitState(nextSize: number, collapsed: boolean): void {
    const wasCollapsed = isCollapsed.value
    const previous = size.value
    isCollapsed.value = collapsed
    size.value = nextSize
    if (!collapsed)
      expandedSize.value = nextSize
    if (wasCollapsed !== collapsed || previous !== nextSize)
      motion.noteChange(wasCollapsed, collapsed)
  }

  function applySize(next: number, collapsed: boolean, bounds = limits(), useSnaps = true): void {
    if (collapsed && collapsible) {
      commitState(0, true)
      return
    }
    commitState(clampSize(next, bounds.min, bounds.max, useSnaps ? snaps : []), false)
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

  function onResizeStart(): void {
    dragging = true
    dragLimits = limits()
    motion.start()
  }

  function applyDisplay(next: number): void {
    if (isCollapsed.value)
      return
    const previous = size.value
    size.value = next
    if (previous !== next)
      motion.noteChange(false, false)
  }

  const props = computed<ResizableProps>(() => {
    const { min, max } = limits()
    const value: ResizableProps = {
      _size: size.value,
      _isCollapsed: isCollapsed.value,
      _onResizeStart: onResizeStart,
      _onResizeMove: motion.move,
      _onResizeEnd: () => motion.end(),
      _onResizeCancel: motion.cancel,
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
      release: motion.end,
    }, reportedMax(min, max))
    registerPropsRegion(value, motion.slot)
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
  onBeforeUnmount(() => {
    observer?.disconnect()
    motion.dispose()
    // 拖动中卸载时没有松手事件，把拖到的尺寸写在退场时。
    if (dragging)
      persist()
  })

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
