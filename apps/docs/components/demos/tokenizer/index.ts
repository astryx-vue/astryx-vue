import { defineDemo } from '../../demo-infra/defineDemo'
import clearDemo from './clear.vue'
import clearSource from './clear.vue?raw&highlighted'
import creatableDemo from './creatable.vue'
import creatableSource from './creatable.vue?raw&highlighted'
import endDemo from './end.vue'
import endSource from './end.vue?raw&highlighted'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import maxDemo from './max.vue'
import maxSource from './max.vue?raw&highlighted'
import overflowDemo from './overflow.vue'
import overflowSource from './overflow.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

export const tokenizerOverview = defineDemo(overviewDemo, overviewSource)
export const tokenizerClear = defineDemo(clearDemo, clearSource)
export const tokenizerCreatable = defineDemo(creatableDemo, creatableSource)
export const tokenizerEnd = defineDemo(endDemo, endSource)
export const tokenizerIcon = defineDemo(iconDemo, iconSource)
export const tokenizerMax = defineDemo(maxDemo, maxSource)
export const tokenizerOverflow = defineDemo(overflowDemo, overflowSource)
export const tokenizerStates = defineDemo(statesDemo, statesSource)
