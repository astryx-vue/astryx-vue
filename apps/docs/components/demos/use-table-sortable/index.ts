import { defineDemo } from '../../demo-infra/defineDemo'
import sortableColumnsDemo from '../table/sortable.vue'
import sortableColumnsSource from '../table/sortable.vue?raw&highlighted'

export const useTableSortableColumns = defineDemo(sortableColumnsDemo, sortableColumnsSource, { className: 'table-preview' })
