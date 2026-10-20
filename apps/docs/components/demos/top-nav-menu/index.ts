import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

// 总览宫格和详情页画布共用这一份；宽度由 .top-nav-menu-preview 收住，居中交给画布。
const options = { className: 'top-nav-menu-preview' }

export const topNavMenuBasic = defineDemo(basicDemo, basicSource, options)
export const topNavMenuOverview = defineDemo(overviewDemo, overviewSource, options)
