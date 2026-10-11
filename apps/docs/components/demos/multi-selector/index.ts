import { defineDemo } from '../../demo-infra/defineDemo'
import badgesDemo from './badges.vue'
import badgesSource from './badges.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

export const multiSelectorBasic = defineDemo(basicDemo, basicSource)
export const multiSelectorBadges = defineDemo(badgesDemo, badgesSource)
export const multiSelectorStates = defineDemo(statesDemo, statesSource)
