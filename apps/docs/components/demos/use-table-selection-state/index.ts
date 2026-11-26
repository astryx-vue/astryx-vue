import { defineDemo } from '../../demo-infra/defineDemo'
import rowSelectionDemo from '../table/row-selection.vue'
import rowSelectionSource from '../table/row-selection.vue?raw&highlighted'
import leadingMarkDemo from './leading-mark.vue'
import leadingMarkSource from './leading-mark.vue?raw&highlighted'

export const useTableSelectionStateRowSelection = defineDemo(rowSelectionDemo, rowSelectionSource, { className: 'table-preview' })
export const useTableSelectionStateLeadingMark = defineDemo(leadingMarkDemo, leadingMarkSource, { className: 'table-preview' })
