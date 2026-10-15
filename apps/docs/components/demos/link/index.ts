import { defineDemo } from '../../demo-infra/defineDemo'
import externalDemo from './external.vue'
import externalSource from './external.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import tooltipsDemo from './tooltips.vue'
import tooltipsSource from './tooltips.vue?raw&highlighted'
import truncateDemo from './truncate.vue'
import truncateSource from './truncate.vue?raw&highlighted'

const options = { className: 'link-preview' }

export const linkExternal = defineDemo(externalDemo, externalSource, options)
export const linkInline = defineDemo(inlineDemo, inlineSource, options)
export const linkTooltips = defineDemo(tooltipsDemo, tooltipsSource, options)
export const linkTruncate = defineDemo(truncateDemo, truncateSource, options)
export const linkOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
