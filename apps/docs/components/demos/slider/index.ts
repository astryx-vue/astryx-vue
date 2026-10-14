import { defineDemo } from '../../demo-infra/defineDemo'
import formattedDemo from './formatted.vue'
import formattedSource from './formatted.vue?raw&highlighted'
import marksDemo from './marks.vue'
import marksSource from './marks.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rangeDemo from './range.vue'
import rangeSource from './range.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const sliderFormatted = defineDemo(formattedDemo, formattedSource, options)
export const sliderRange = defineDemo(rangeDemo, rangeSource, options)
export const sliderMarks = defineDemo(marksDemo, marksSource, options)
export const sliderStatus = defineDemo(statusDemo, statusSource, options)

export const sliderOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
