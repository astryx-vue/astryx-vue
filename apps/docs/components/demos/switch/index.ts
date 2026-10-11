import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const switchBasic = defineDemo(basicDemo, basicSource, options)
export const switchSizes = defineDemo(sizesDemo, sizesSource, options)
export const switchStates = defineDemo(statesDemo, statesSource, options)

export const switchOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
