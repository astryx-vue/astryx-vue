import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import clearableDemo from './clearable.vue'
import clearableSource from './clearable.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const dateInputBasic = defineDemo(basicDemo, basicSource)
export const dateInputClearable = defineDemo(clearableDemo, clearableSource)

export const dateInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
