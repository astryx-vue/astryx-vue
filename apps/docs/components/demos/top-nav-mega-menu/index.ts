import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

// 总览宫格和详情页画布共用同一份：原版只有这一个示例。
// 宽度由 .top-nav-mega-menu-preview 收住，居中交给画布。
export const topNavMegaMenuOverview = defineDemo(overviewDemo, overviewSource, { className: 'top-nav-mega-menu-preview' })
