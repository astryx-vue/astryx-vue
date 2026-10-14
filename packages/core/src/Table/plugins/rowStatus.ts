import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { IconColor } from '../../Icon/types.js'
import type { TablePlugin } from '../types.js'
import { h, toValue } from 'vue'
import Icon from '../../Icon/Icon.vue'
import { useAstryxMessages } from '../../locale/context.js'
import Tooltip from '../../Tooltip/Tooltip.vue'
import { pixel } from '../columnUtils.js'

export type TableRowStatusName = 'success' | 'warning' | 'error'

export type TableRowStatusColor
  = | 'accent'
    | 'success'
    | 'error'
    | 'warning'
    | 'red'
    | 'orange'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'gray'

export interface TableSemanticRowStatus {
  status: TableRowStatusName
  label: string
  color?: never
  icon?: never
}

export interface TableCustomRowStatus {
  status?: never
  color: TableRowStatusColor | (string & {})
  icon?: string
  label: string
}

export type TableRowStatus = TableSemanticRowStatus | TableCustomRowStatus

export interface UseTableRowStatusConfig<T extends Record<string, unknown>> {
  getStatus: (item: T) => TableRowStatus | null
}

const NAMED_DOT: Record<string, string> = {
  accent: 'var(--astryx-color-icon-accent)',
  success: 'var(--astryx-color-icon-green)',
  error: 'var(--astryx-color-icon-red)',
  warning: 'var(--astryx-color-icon-orange)',
  red: 'var(--astryx-color-icon-red)',
  orange: 'var(--astryx-color-icon-orange)',
  green: 'var(--astryx-color-icon-green)',
  yellow: 'var(--astryx-color-icon-yellow)',
  blue: 'var(--astryx-color-icon-blue)',
  gray: 'var(--astryx-color-icon-gray)',
}

const NAMED_ICON_COLOR: Record<string, IconColor> = {
  accent: 'accent',
  success: 'success',
  error: 'error',
  warning: 'warning',
  red: 'red',
  orange: 'warning',
  green: 'green',
  yellow: 'warning',
  blue: 'blue',
  gray: 'gray',
}

const SEMANTIC_ICON = {
  success: 'check',
  warning: 'warning',
  error: 'error',
} as const

function statusMark(status: TableRowStatus): VNodeChild {
  if (status.status != null)
    return h(Icon, { icon: SEMANTIC_ICON[status.status], size: 'xsm', color: status.status })
  if (status.icon) {
    const named = NAMED_ICON_COLOR[status.color]
    return status.icon.includes(':')
      ? h(Icon, { name: status.icon, size: 'xsm', color: named ?? 'inherit' })
      : h(Icon, { icon: status.icon, size: 'xsm', color: named ?? 'inherit' })
  }
  const color = NAMED_DOT[status.color] ?? status.color
  return h('span', { class: 'astryx-table__status-dot', style: { backgroundColor: color } })
}

export function useTableRowStatus<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableRowStatusConfig<T>>,
): TablePlugin<T> {
  const messages = useAstryxMessages()
  return {
    transformColumns(columns) {
      return [{
        key: '__rowStatus',
        header: messages.value.table.rowStatus,
        headerHidden: true,
        width: pixel(28),
        resizable: false,
        renderCell(item: T) {
          const status = toValue(config).getStatus(item)
          if (status == null)
            return null
          const customColor = status.status == null && status.icon != null && NAMED_ICON_COLOR[status.color] == null
            ? status.color
            : undefined
          return h(Tooltip, { content: status.label }, {
            default: () => h('span', {
              'class': 'astryx-table__status',
              'role': 'img',
              'aria-label': status.label,
              'style': customColor ? { color: customColor } : undefined,
            }, [statusMark(status)]),
          })
        },
      }, ...columns]
    },
  }
}
