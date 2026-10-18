import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const segmentedControlItemBasic = defineDemo(basicDemo, basicSource)
export const segmentedControlItemOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
