import { defineDemo } from '../../demo-infra/defineDemo'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import externalDemo from './external.vue'
import externalSource from './external.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const linkColors = defineDemo(colorsDemo, colorsSource, {
  className: 'link-preview',
})

export const linkExternal = defineDemo(externalDemo, externalSource, {
  className: 'link-preview',
})

export const linkOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
