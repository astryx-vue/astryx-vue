import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const dialogHeaderBasic = defineDemo(basicDemo, basicSource, options)
// 总览和详情页画布都用这一份：外层不设宽度，交给画布的居中规则摆放。
export const dialogHeaderOverview = defineDemo(overviewDemo, overviewSource)
