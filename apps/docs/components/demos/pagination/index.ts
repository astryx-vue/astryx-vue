import { defineDemo } from '../../demo-infra/defineDemo'
import dotsDemo from './dots.vue'
import dotsSource from './dots.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import pageSizeDemo from './page-size.vue'
import pageSizeSource from './page-size.vue?raw&highlighted'
import withTableDemo from './with-table.vue'
import withTableSource from './with-table.vue?raw&highlighted'

const options = { className: 'pagination-preview' }

export const paginationDots = defineDemo(dotsDemo, dotsSource, options)
export const paginationPageSize = defineDemo(pageSizeDemo, pageSizeSource, options)
export const paginationWithTable = defineDemo(withTableDemo, withTableSource, options)
export const paginationOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
