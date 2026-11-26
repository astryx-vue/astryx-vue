import { defineDemo } from '../../demo-infra/defineDemo'
import wideTableDemo from './wide-table.vue'
import wideTableSource from './wide-table.vue?raw&highlighted'

export const useTableColumnsVirtualizationWideTable = defineDemo(wideTableDemo, wideTableSource, { className: 'table-preview' })
