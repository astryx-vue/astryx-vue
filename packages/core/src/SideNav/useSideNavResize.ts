import type { ComputedRef, Ref } from 'vue'
import type { ResizableProps } from '../composables/useResizable.js'
import type { SideNavCollapsible, SideNavResizable } from './types.js'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { useResizable } from '../composables/useResizable.js'

/** 拖到这条宽度以下就收起。收起后的视觉宽度仍由图标栏样式决定。 */
const COLLAPSE_THRESHOLD = 160

export interface SideNavResizeSource {
  resizable: () => boolean | SideNavResizable | undefined
  collapsible: () => boolean | SideNavCollapsible | undefined
  isCollapsed: () => boolean | undefined
  onCollapseChange: (isCollapsed: boolean) => void
  onWidthChange: (width: number) => void
}

export interface SideNavResize {
  enabled: ComputedRef<boolean>
  ownsCollapse: ComputedRef<boolean>
  isCollapsed: ComputedRef<boolean>
  widthStyle: ComputedRef<{ width: string } | undefined>
  resizing: Ref<boolean>
  handleProps: ComputedRef<ResizableProps>
  setCollapsed: (next: boolean) => void
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

function resizeConfig(value: boolean | SideNavResizable | undefined): ResizeConfig {
  return typeof value === 'object' && value != null ? value : {}
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

  const region = useResizable(input)
  const resizing = ref(false)

  const enabled = computed(() => Boolean(source.resizable()))
  const ownsCollapse = computed(() => ownsCollapseState(resizeConfig(source.resizable())))

  watch(() => source.isCollapsed(), (value) => {
    input.isCollapsed = value
  })

  let warnedConflict = false
  watchEffect(() => {
    if (warnedConflict)
      return
    const message = describeCollapseConflict(
      collapseConfig(source.collapsible()),
      resizeConfig(source.resizable()),
    )
    if (!message)
      return
    warnedConflict = true
    console.warn(`[SideNav] ${message}`)
  })

  const handleProps = computed<ResizableProps>(() => {
    const current = region.props
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
    if (!enabled.value || region.isCollapsed)
      return undefined
    return { width: `${region.size}px` }
  })

  return {
    enabled,
    ownsCollapse,
    isCollapsed: computed(() => region.isCollapsed),
    widthStyle,
    resizing,
    handleProps,
    setCollapsed(next: boolean) {
      if (next)
        region.collapse()
      else
        region.expand()
    },
  }
}
