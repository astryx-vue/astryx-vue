import { defineDemo } from '../../demo-infra/defineDemo'
import multiSortOrdersDemo from './multi-sort-orders.vue'
import multiSortOrdersSource from './multi-sort-orders.vue?raw&highlighted'

export const useTableSortableStateMultiSortOrders = defineDemo(multiSortOrdersDemo, multiSortOrdersSource, { className: 'table-preview' })
