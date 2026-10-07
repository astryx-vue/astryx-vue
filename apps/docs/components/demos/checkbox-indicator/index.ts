import { defineDemo } from '../../demo-infra/defineDemo'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const checkboxIndicatorStates = defineDemo(statesDemo, statesSource, options)
