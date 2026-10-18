import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

// 总览宫格和详情页画布共用 overview；宽度和列数写在 .top-nav-mega-menu-item-preview 里。
export const topNavMegaMenuItemOverview = defineDemo(overviewDemo, overviewSource, { className: 'top-nav-mega-menu-item-preview' })

export const topNavMegaMenuItemBasic = defineDemo(basicDemo, basicSource, { className: 'top-nav-mega-menu-item-preview' })
