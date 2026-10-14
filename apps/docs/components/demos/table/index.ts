import { defineDemo } from '../../demo-infra/defineDemo'
import columnSettingsDemo from './column-settings.vue'
import columnSettingsSource from './column-settings.vue?raw&highlighted'
import expansionDemo from './expansion.vue'
import expansionSource from './expansion.vue?raw&highlighted'
import gridDividersDemo from './grid-dividers.vue'
import gridDividersSource from './grid-dividers.vue?raw&highlighted'
import groupedDemo from './grouped.vue'
import groupedSource from './grouped.vue?raw&highlighted'
import inCardDemo from './in-card.vue'
import inCardSource from './in-card.vue?raw&highlighted'
import inlineFiltersDemo from './inline-filters.vue'
import inlineFiltersSource from './inline-filters.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import paginatedDemo from './paginated.vue'
import paginatedSource from './paginated.vue?raw&highlighted'
import popoverFiltersDemo from './popover-filters.vue'
import popoverFiltersSource from './popover-filters.vue?raw&highlighted'
import resizableDemo from './resizable.vue'
import resizableSource from './resizable.vue?raw&highlighted'
import richCellDemo from './rich-cell.vue'
import richCellSource from './rich-cell.vue?raw&highlighted'
import rowSelectionDemo from './row-selection.vue'
import rowSelectionSource from './row-selection.vue?raw&highlighted'
import rowStatusDemo from './row-status.vue'
import rowStatusSource from './row-status.vue?raw&highlighted'
import sortableDemo from './sortable.vue'
import sortableSource from './sortable.vue?raw&highlighted'
import stickyDemo from './sticky.vue'
import stickySource from './sticky.vue?raw&highlighted'
import stripedDemo from './striped.vue'
import stripedSource from './striped.vue?raw&highlighted'
import treeDemo from './tree.vue'
import treeSource from './tree.vue?raw&highlighted'

const wide = { className: 'table-preview' }

export const tableOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const tableExpansion = defineDemo(expansionDemo, expansionSource, wide)
export const tableGrouped = defineDemo(groupedDemo, groupedSource, wide)
export const tableColumnSettings = defineDemo(columnSettingsDemo, columnSettingsSource, wide)
export const tableGridDividers = defineDemo(gridDividersDemo, gridDividersSource, wide)
export const tableInCard = defineDemo(inCardDemo, inCardSource, wide)
export const tableInlineFilters = defineDemo(inlineFiltersDemo, inlineFiltersSource, wide)
export const tablePaginated = defineDemo(paginatedDemo, paginatedSource, wide)
export const tablePopoverFilters = defineDemo(popoverFiltersDemo, popoverFiltersSource, wide)
export const tableResizable = defineDemo(resizableDemo, resizableSource, wide)
export const tableRichCell = defineDemo(richCellDemo, richCellSource, wide)
export const tableRowSelection = defineDemo(rowSelectionDemo, rowSelectionSource, wide)
export const tableRowStatus = defineDemo(rowStatusDemo, rowStatusSource, wide)
export const tableSortable = defineDemo(sortableDemo, sortableSource, wide)
export const tableSticky = defineDemo(stickyDemo, stickySource, wide)
export const tableStriped = defineDemo(stripedDemo, stripedSource, wide)
export const tableTree = defineDemo(treeDemo, treeSource, wide)
