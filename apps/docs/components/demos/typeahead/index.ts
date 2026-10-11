import { defineDemo } from '../../demo-infra/defineDemo'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import staticDemo from './static.vue'
import staticSource from './static.vue?raw&highlighted'

export const typeaheadStatic = defineDemo(staticDemo, staticSource)
export const typeaheadAsync = defineDemo(asyncDemo, asyncSource)
export const typeaheadStates = defineDemo(statesDemo, statesSource)
