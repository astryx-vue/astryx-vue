import { defineDemo } from '../../demo-infra/defineDemo'
import draggableColumnsDemo from '../table/resizable.vue'
import draggableColumnsSource from '../table/resizable.vue?raw&highlighted'

export const useTableColumnResizeDraggableColumns = defineDemo(draggableColumnsDemo, draggableColumnsSource, { className: 'table-preview' })
