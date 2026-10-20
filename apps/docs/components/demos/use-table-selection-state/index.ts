import { defineDemo } from '../../demo-infra/defineDemo'
import rowSelectionDemo from '../table/row-selection.vue'
import rowSelectionSource from '../table/row-selection.vue?raw&highlighted'

export const useTableSelectionStateRowSelection = defineDemo(rowSelectionDemo, rowSelectionSource, { className: 'table-preview' })
