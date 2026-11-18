import { defineDemo } from '../../demo-infra/defineDemo'
import fieldLabelDemo from './field-label.vue'
import fieldLabelSource from './field-label.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const infoTipOverview = defineDemo(overviewDemo, overviewSource, options)
export const infoTipSizes = defineDemo(sizesDemo, sizesSource, options)
export const infoTipFieldLabel = defineDemo(fieldLabelDemo, fieldLabelSource, options)
