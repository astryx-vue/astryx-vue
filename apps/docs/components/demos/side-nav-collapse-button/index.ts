import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'side-nav-preview' }

export const sideNavCollapseButtonBasic = defineDemo(basicDemo, basicSource, options)
export const sideNavCollapseButtonOverview = defineDemo(overviewDemo, overviewSource, options)
