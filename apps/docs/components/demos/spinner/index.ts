import { defineDemo } from '../../demo-infra/defineDemo'
import labelDemo from './label.vue'
import labelSource from './label.vue?raw&highlighted'
import mediaDemo from './media.vue'
import mediaSource from './media.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const spinnerMedia = defineDemo(mediaDemo, mediaSource, options)
export const spinnerSizes = defineDemo(sizesDemo, sizesSource, options)
export const spinnerLabel = defineDemo(labelDemo, labelSource, options)

export const spinnerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
