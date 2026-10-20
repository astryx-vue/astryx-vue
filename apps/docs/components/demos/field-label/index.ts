import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'overview-frame' }

export const fieldLabelBasic = defineDemo(basicDemo, basicSource, options)
export const fieldLabelOverview = defineDemo(overviewDemo, overviewSource, options)
