import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import presetsDemo from './presets.vue'
import presetsSource from './presets.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const options = { className: 'date-preview-host' }
export const dateRangeInputPresets = defineDemo(presetsDemo, presetsSource, options)
export const dateRangeInputValidation = defineDemo(validationDemo, validationSource, options)
export const dateRangeInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
