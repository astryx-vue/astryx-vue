import type { ComputedRef } from 'vue'
import type { ListWindowKey, ListWindowSegment } from '../../../composables/internal/listWindow/listWindow.js'
import type { ListWindowGeometry } from '../../../composables/internal/listWindow/listWindowGeometry.js'
import type { TableVirtualizationContribution } from '../../types.js'
import { computed, shallowRef, watch } from 'vue'
import { calculateListWindow } from '../../../composables/internal/listWindow/listWindow.js'
import { useListWindow } from '../../../composables/internal/listWindow/useListWindow.js'
import { devWarn } from '../../../composables/useDevWarning.js'
import { checkMountedRows, PITCH_EPSILON } from './rowGeometryCheck.js'

type RowsConfig = ReturnType<NonNullable<TableVirtualizationContribution['rows']>>

export interface UseTableRowWindowOptions {
  /** 行窗口化插件给的配置；没有这个插件时为 `undefined`。 */
  config: () => RowsConfig | undefined
  keys: () => readonly ListWindowKey[]
  /** 表格这一侧的放行条件已经满足，或者给出了退回全部渲染的原因。 */
  fallbackReason: () => string | undefined
  geometry: () => ListWindowGeometry
  viewport: () => HTMLElement | null
  body: () => HTMLTableSectionElement | null
}

export interface TableRowWindow {
  /** 行窗口化放行了（表格在父元素给的高度里滚动，行定高）。 */
  isActive: ComputedRef<boolean>
  isWindowed: ComputedRef<boolean>
  segments: ComputedRef<ListWindowSegment[]>
  /** 实际用的行高：声明值，或所有行一起变高后量到的值。 */
  rowHeight: ComputedRef<number>
  /** 每一行的最小高度：声明的行高。 */
  minRowHeight: ComputedRef<number>
  onRowFocus: (key: ListWindowKey) => void
  onRowBlur: () => void
}

interface Rejection {
  keys: readonly ListWindowKey[]
  config: RowsConfig
  reason: string
}

function hasValidGeometry(config: RowsConfig, rowCount: number): boolean {
  return calculateListWindow({
    rowCount,
    rowHeight: config.rowHeight,
    viewportHeight: config.initialViewportHeight,
    scrollTop: 0,
    startOffset: 0,
    isMeasured: false,
  }) !== null
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * 表格接到共用行窗口上的那一层：决定放不放行，挂载之后检查行是不是真的定高，
 * 所有行一起变高时改用量到的行高，内容溢出或行高不一时退回全部渲染。
 */
export function useTableRowWindow(options: UseTableRowWindowOptions): TableRowWindow {
  const rejection = shallowRef<Rejection | undefined>()
  const measuredPitch = shallowRef<{ config: RowsConfig, rowHeight: number } | undefined>()
  // 配置是 getter 返回的新对象：按值比较，值没变就沿用同一个对象。
  const declared = computed<RowsConfig | undefined>((previous) => {
    const next = options.config()
    if (next != null && previous != null && next.rowHeight === previous.rowHeight && next.initialViewportHeight === previous.initialViewportHeight)
      return previous
    return next
  })

  const reason = computed(() => {
    const config = declared.value
    if (config == null)
      return undefined
    const shared = options.fallbackReason()
    if (shared != null)
      return shared
    if (!hasValidGeometry(config, options.keys().length))
      return 'rowHeight and initialViewportHeight must be positive finite CSS pixels'
    return undefined
  })
  const isRejected = computed(() => rejection.value != null
    && rejection.value.keys === options.keys()
    && rejection.value.config === declared.value)
  const isActive = computed(() => declared.value != null && reason.value == null && !isRejected.value)

  const pitch = computed(() => {
    const config = declared.value
    if (config == null)
      return undefined
    const measured = measuredPitch.value?.config === config ? measuredPitch.value.rowHeight : undefined
    return { rowHeight: measured ?? config.rowHeight, viewportHeight: config.initialViewportHeight }
  })
  const keyIndices = computed(() => new Map(options.keys().map((key, index) => [key, index])))
  const window = useListWindow({
    keys: options.keys,
    keyIndices: () => keyIndices.value,
    pitch: () => pitch.value,
    canWindow: () => isActive.value && options.keys().length > 0,
    geometry: options.geometry,
    viewport: options.viewport,
  })

  watch(reason, (current) => {
    if (current != null)
      devWarn('Table', `Windowing disabled: ${current}. Rendering all rows.`)
  }, { immediate: true })
  watch(isRejected, (current) => {
    if (current)
      devWarn('Table', `${rejection.value?.reason} Rendering all rows without fixed constraints.`)
  })

  // 挂载之后按真实行检查。尺寸类变化会让上次通过的行也重新检查。
  let checked = new WeakSet<HTMLTableRowElement>()
  let checkedLayout = -1
  watch([window.segments, () => options.geometry().revision], () => {
    const body = options.body()
    const config = declared.value
    const current = pitch.value
    if (!window.isWindowed.value || body == null || config == null || current == null)
      return
    const layout = options.geometry().layoutRevision
    if (layout !== checkedLayout) {
      checked = new WeakSet()
      checkedLayout = layout
    }
    const check = checkMountedRows(body, current.rowHeight, checked)
    if (check === undefined)
      return
    if ('reason' in check) {
      rejection.value = { keys: options.keys(), config, reason: check.reason }
      return
    }
    const isDeclared = Math.abs(check.pitch - config.rowHeight) < PITCH_EPSILON
    measuredPitch.value = isDeclared ? undefined : { config, rowHeight: check.pitch }
    checked = new WeakSet()
    if (!isDeclared)
      devWarn('Table', `Rows measure ${round(check.pitch)}px, not rowHeight ${round(config.rowHeight)}px. Windowing uses the measured height.`)
  }, { flush: 'post' })

  return {
    isActive,
    isWindowed: window.isWindowed,
    segments: window.segments,
    rowHeight: computed(() => pitch.value?.rowHeight ?? 0),
    minRowHeight: computed(() => declared.value?.rowHeight ?? 0),
    onRowFocus: window.onItemFocus,
    onRowBlur: window.onItemBlur,
  }
}
