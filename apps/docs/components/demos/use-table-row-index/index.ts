import { defineDemo } from '../../demo-infra/defineDemo'
import numberedRowsDemo from './numbered-rows.vue'
import numberedRowsSource from './numbered-rows.vue?raw&highlighted'

export const useTableRowIndexNumberedRows = defineDemo(numberedRowsDemo, numberedRowsSource, { className: 'table-preview' })
