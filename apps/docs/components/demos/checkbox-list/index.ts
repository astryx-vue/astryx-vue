import { defineDemo } from '../../demo-infra/defineDemo'
import endContentDemo from './end-content.vue'
import endContentSource from './end-content.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import selectAllDemo from './select-all.vue'
import selectAllSource from './select-all.vue?raw&highlighted'

export const checkboxListSelectAll = defineDemo(selectAllDemo, selectAllSource)
export const checkboxListEndContent = defineDemo(endContentDemo, endContentSource)
export const checkboxListOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
