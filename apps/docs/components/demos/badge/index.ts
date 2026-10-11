import { defineDemo } from '../../demo-infra/defineDemo'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import countsDemo from './counts.vue'
import countsSource from './counts.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const badgeColors = defineDemo(colorsDemo, colorsSource, {
  className: 'badge-preview badge-preview--colors',
})
export const badgeCounts = defineDemo(countsDemo, countsSource, {
  className: 'badge-preview badge-preview--counts',
})

export const badgeOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
