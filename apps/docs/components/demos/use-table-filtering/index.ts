import { defineDemo } from '../../demo-infra/defineDemo'
import inlineFiltersDemo from '../table/inline-filters.vue'
import inlineFiltersSource from '../table/inline-filters.vue?raw&highlighted'
import popoverFiltersDemo from '../table/popover-filters.vue'
import popoverFiltersSource from '../table/popover-filters.vue?raw&highlighted'

export const useTableFilteringInline = defineDemo(inlineFiltersDemo, inlineFiltersSource, { className: 'table-preview' })
export const useTableFilteringPopover = defineDemo(popoverFiltersDemo, popoverFiltersSource, { className: 'table-preview' })
