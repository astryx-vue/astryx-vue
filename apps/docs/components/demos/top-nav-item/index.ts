import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'top-nav-item-preview' }

export const topNavItemBasic = defineDemo(basicDemo, basicSource, options)
export const topNavItemOverview = defineDemo(overviewDemo, overviewSource, options)
