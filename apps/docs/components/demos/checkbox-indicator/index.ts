import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const checkboxIndicatorOverview = defineDemo(overviewDemo, overviewSource, options)
export const checkboxIndicatorStates = defineDemo(statesDemo, statesSource, options)
