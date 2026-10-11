import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import iconsDemo from './icons.vue'
import iconsSource from './icons.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'segmented-control-preview' }

export const segmentedControlBasic = defineDemo(basicDemo, basicSource, options)
export const segmentedControlSizes = defineDemo(sizesDemo, sizesSource, options)
export const segmentedControlIcons = defineDemo(iconsDemo, iconsSource, options)
export const segmentedControlStates = defineDemo(statesDemo, statesSource, options)

export const segmentedControlOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
