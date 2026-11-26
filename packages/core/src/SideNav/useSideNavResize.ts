import type { ComputedRef, Ref } from 'vue'
import type { ResizableProps, ResizableRegion } from '../composables/useResizable.js'
import type { SideNavCollapsible, SideNavResizable } from './types.js'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { useResizable } from '../composables/useResizable.js'

/** 拖到这条宽度以下就收起。收起后的视觉宽度仍由图标栏样式决定。 */
const COLLAPSE_THRESHOLD = 160

export interface SideNavResizeSource {
  resizable: () => boolean | SideNavResizable | ResizableRegion | undefined
  collapsible: () => boolean | SideNavCollapsible | undefined
  isCollapsed: () => boolean | undefined
  onCollapseChange: (isCollapsed: boolean) => void
  onWidthChange: (width: number) => void
}

export interface SideNavResize {
  enabled: ComputedRef<boolean>
  ownsCollapse: ComputedRef<boolean>
  /** 区域自己的 `collapsible` 选项；不是调用方给的区域时为 undefined。 */
  isCollapsibleOverride: ComputedRef<boolean | undefined>
  isCollapsed: ComputedRef<boolean>
  widthStyle: ComputedRef<{ width: string } | undefined>
  resizing: Ref<boolean>
  handleProps: ComputedRef<ResizableProps>
  setCollapsed: (next: boolean) => void
}

/** `resizable` 传的是不是 `useResizable()` 的返回值：它自己带着区域的宽度和收起状态。 */
export function isResizableRegion(value: unknown): value is ResizableRegion {
  if (typeof value !== 'object' || value == null)
    return false
  const region = value as Partial<ResizableRegion>
  return typeof region.collapse === 'function'
    && typeof region.expand === 'function'
    && region.props?._isResizableProps === true
}

interface ResizeConfig {
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  autoSaveId?: string
  onWidthChange?: (width: number) => void
  defaultIsCollapsed?: boolean
  isCollapsed?: boolean
  onCollapseChange?: (isCollapsed: boolean) => void
}

function resizeConfig(value: boolean | SideNavResizable | ResizableRegion | undefined): ResizeConfig {
  return typeof value === 'object' && value != null && !isResizableRegion(value) ? value : {}
}

function collapseConfig(value: boolean | SideNavCollapsible | undefined): SideNavCollapsible {
  return typeof value === 'object' && value != null ? value : {}
}

function ownsCollapseState(config: ResizeConfig): boolean {
  return config.defaultIsCollapsed !== undefined
    || config.isCollapsed !== undefined
    || config.onCollapseChange !== undefined
}

export function describeCollapseConflict(
  collapsible: SideNavCollapsible,
  resizable: ResizeConfig,
): string | null {
  const fromCollapsible = [
    collapsible.defaultIsCollapsed !== undefined && 'defaultIsCollapsed',
    collapsible.isCollapsed !== undefined && 'isCollapsed',
  ].filter((key): key is string => key !== false)
  const fromResizable = [
    resizable.defaultIsCollapsed !== undefined && 'defaultIsCollapsed',
    resizable.isCollapsed !== undefined && 'isCollapsed',
    resizable.onCollapseChange !== undefined && 'onCollapseChange',
  ].filter((key): key is string => key !== false)
  if (fromCollapsible.length === 0 || fromResizable.length === 0)
    return null
  return `collapsible 和 resizable 都写了收起状态（${fromResizable.join('、')}）。拖拽这边生效。`
}

/**
 * `resizable` 是区域返回值时，区域拥有宽度和收起状态，并由它自己的 `collapsible` 决定轨道能不能收起。
 * `collapsible` 里写了收起状态、或者和区域不一致，都以区域为准，返回要在开发环境里警告的说明。
 */
export function describeRegionConflict(
  collapsible: boolean | SideNavCollapsible | undefined,
  region: ResizableRegion,
): string | null {
  const given = collapseConfig(collapsible)
  const ignored = [
    given.defaultIsCollapsed !== undefined && 'defaultIsCollapsed',
    given.isCollapsed !== undefined && 'isCollapsed',
  ].filter((key): key is string => key !== false)
  const conflicts: string[] = []
  if (ignored.length > 0)
    conflicts.push(`collapsible 写了 ${ignored.join('、')}，轨道不看它，跟着区域走。`)
  const regionCollapsible = region.props._collapsible
  if (collapsible !== undefined && Boolean(collapsible) !== regionCollapsible) {
    conflicts.push(regionCollapsible
      ? 'collapsible 是 false，但区域可收起，轨道仍会收起。'
      : 'collapsible 打开了收起，但区域不可收起，轨道不会收起。')
  }
  return conflicts.length === 0
    ? null
    : `resizable 是 useResizable() 的返回值，收起状态和能否收起都由它决定。${conflicts.join('')}`
}

export function useSideNavResize(source: SideNavResizeSource): SideNavResize {
  const initialResize = resizeConfig(source.resizable())
  const initialCollapse = collapseConfig(source.collapsible())
  const initialOwns = ownsCollapseState(initialResize)
  const controlled = source.isCollapsed()

  const input = reactive({
    defaultSize: initialResize.defaultWidth ?? 260,
    minSize: initialResize.minWidth ?? 180,
    maxSize: initialResize.maxWidth ?? 480,
    collapsible: Boolean(source.collapsible()) || initialOwns,
    collapsedSize: COLLAPSE_THRESHOLD,
    autoSaveId: initialResize.autoSaveId,
    defaultIsCollapsed: (initialOwns ? initialResize.defaultIsCollapsed : initialCollapse.defaultIsCollapsed) ?? false,
    isCollapsed: controlled,
    onSizeChange(width: number) {
      resizeConfig(source.resizable()).onWidthChange?.(width)
      source.onWidthChange(width)
    },
    onCollapseChange(next: boolean) {
      resizeConfig(source.resizable()).onCollapseChange?.(next)
      source.onCollapseChange(next)
    },
  })

  const ownRegion = useResizable(input)
  const resizing = ref(false)

  const owner = computed(() => {
    const value = source.resizable()
    return isResizableRegion(value) ? value : null
  })
  /** 调用方给了区域就用区域；否则用组件自己按配置建的那个。 */
  const active = (): ResizableRegion => owner.value ?? ownRegion

  const enabled = computed(() => Boolean(source.resizable()))
  const ownsCollapse = computed(() => owner.value != null || ownsCollapseState(resizeConfig(source.resizable())))
  const isCollapsibleOverride = computed(() => owner.value == null ? undefined : owner.value.props._collapsible)

  watch(() => source.isCollapsed(), (value) => {
    input.isCollapsed = value
  })

  let warnedConflict = false
  watchEffect(() => {
    if (warnedConflict)
      return
    const value = source.resizable()
    const message = isResizableRegion(value)
      ? describeRegionConflict(source.collapsible(), value)
      : describeCollapseConflict(
          collapseConfig(source.collapsible()),
          resizeConfig(value),
        )
    if (!message)
      return
    warnedConflict = true
    console.warn(`[SideNav] ${message}`)
  })

  const handleProps = computed<ResizableProps>(() => {
    const current = active().props
    return {
      ...current,
      _onResizeStart() {
        resizing.value = true
        current._onResizeStart()
      },
      _onResizeEnd() {
        resizing.value = false
        current._onResizeEnd()
      },
      _onResizeCancel() {
        resizing.value = false
        current._onResizeCancel?.()
      },
    }
  })

  const widthStyle = computed(() => {
    if (!enabled.value || active().isCollapsed)
      return undefined
    return { width: `${active().size}px` }
  })

  return {
    enabled,
    ownsCollapse,
    isCollapsibleOverride,
    isCollapsed: computed(() => active().isCollapsed),
    widthStyle,
    resizing,
    handleProps,
    setCollapsed(next: boolean) {
      if (next)
        active().collapse()
      else
        active().expand()
    },
  }
}
