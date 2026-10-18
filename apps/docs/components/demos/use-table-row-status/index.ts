import { defineDemo } from '../../demo-infra/defineDemo'
import statusMarksDemo from '../table/row-status.vue'
import statusMarksSource from '../table/row-status.vue?raw&highlighted'

export const useTableRowStatusMarkers = defineDemo(statusMarksDemo, statusMarksSource, { className: 'table-preview' })
