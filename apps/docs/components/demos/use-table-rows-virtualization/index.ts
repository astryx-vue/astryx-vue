import { defineDemo } from '../../demo-infra/defineDemo'
import thousandRowsDemo from './thousand-rows.vue'
import thousandRowsSource from './thousand-rows.vue?raw&highlighted'

export const useTableRowsVirtualizationThousandRows = defineDemo(thousandRowsDemo, thousandRowsSource, { className: 'table-preview' })
