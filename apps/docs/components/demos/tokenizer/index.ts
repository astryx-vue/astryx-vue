import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overflowDemo from './overflow.vue'
import overflowSource from './overflow.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

export const tokenizerBasic = defineDemo(basicDemo, basicSource)
export const tokenizerOverflow = defineDemo(overflowDemo, overflowSource)
export const tokenizerStates = defineDemo(statesDemo, statesSource)
