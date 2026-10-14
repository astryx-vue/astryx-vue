import { defineDemo } from '../../demo-infra/defineDemo'
import indeterminateDemo from './indeterminate.vue'
import indeterminateSource from './indeterminate.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const checkboxInputStates = defineDemo(statesDemo, statesSource, options)
export const checkboxInputIndeterminate = defineDemo(indeterminateDemo, indeterminateSource, options)
export const checkboxInputStatus = defineDemo(statusDemo, statusSource, options)

export const checkboxInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
