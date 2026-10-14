import { defineDemo } from '../../demo-infra/defineDemo'
import countDemo from './count.vue'
import countSource from './count.vue?raw&highlighted'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const textAreaCount = defineDemo(countDemo, countSource, options)
export const textAreaStates = defineDemo(statesDemo, statesSource, options)
export const textAreaValidation = defineDemo(validationDemo, validationSource, options)
export const textAreaIcon = defineDemo(iconDemo, iconSource, options)

export const textAreaOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
