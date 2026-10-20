import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'layout-content-preview' }

export const layoutContentBasic = defineDemo(basicDemo, basicSource, options)
export const layoutContentOverview = defineDemo(overviewDemo, overviewSource, options)
