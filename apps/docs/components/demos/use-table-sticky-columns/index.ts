import { defineDemo } from '../../demo-infra/defineDemo'
import pinnedColumnsDemo from '../table/sticky.vue'
import pinnedColumnsSource from '../table/sticky.vue?raw&highlighted'

export const useTableStickyColumnsPinned = defineDemo(pinnedColumnsDemo, pinnedColumnsSource, { className: 'table-preview' })
