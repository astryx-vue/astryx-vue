import { defineDemo } from '../../demo-infra/defineDemo'
import collapsibleGroupsDemo from '../table/grouped.vue'
import collapsibleGroupsSource from '../table/grouped.vue?raw&highlighted'

export const useTableGroupedRowsCollapsible = defineDemo(collapsibleGroupsDemo, collapsibleGroupsSource, { className: 'table-preview' })
