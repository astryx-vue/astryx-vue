import { defineDemo } from '../../demo-infra/defineDemo'
import contentSlotDemo from './content-slot.vue'
import contentSlotSource from './content-slot.vue?raw&highlighted'
import indicatorDemo from './indicator.vue'
import indicatorSource from './indicator.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'overview-hug' }

export const stepContentSlot = defineDemo(contentSlotDemo, contentSlotSource, options)
export const stepIndicator = defineDemo(indicatorDemo, indicatorSource, options)
export const stepOverview = defineDemo(overviewDemo, overviewSource, options)
export const stepStates = defineDemo(statesDemo, statesSource, options)
