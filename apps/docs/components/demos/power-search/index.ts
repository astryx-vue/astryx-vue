import { defineDemo } from '../../demo-infra/defineDemo'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import nestedDemo from './nested.vue'
import nestedSource from './nested.vue?raw&highlighted'
import overflowDemo from './overflow.vue'
import overflowSource from './overflow.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const powerSearchOverview = defineDemo(overviewDemo, overviewSource)
export const powerSearchOverflow = defineDemo(overflowDemo, overflowSource)
export const powerSearchNested = defineDemo(nestedDemo, nestedSource)
export const powerSearchDisabled = defineDemo(disabledDemo, disabledSource)
