import { defineDemo } from '../../demo-infra/defineDemo'
import autoDemo from './auto.vue'
import autoSource from './auto.vue?raw&highlighted'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import formatsDemo from './formats.vue'
import formatsSource from './formats.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import relativeDemo from './relative.vue'
import relativeSource from './relative.vue?raw&highlighted'
import timezoneDemo from './timezone.vue'
import timezoneSource from './timezone.vue?raw&highlighted'
import tooltipDemo from './tooltip.vue'
import tooltipSource from './tooltip.vue?raw&highlighted'

export const timestampOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const timestampAuto = defineDemo(autoDemo, autoSource)
export const timestampColors = defineDemo(colorsDemo, colorsSource)
export const timestampFormats = defineDemo(formatsDemo, formatsSource)
export const timestampRelative = defineDemo(relativeDemo, relativeSource)
export const timestampTimezone = defineDemo(timezoneDemo, timezoneSource)
export const timestampTooltip = defineDemo(tooltipDemo, tooltipSource)
