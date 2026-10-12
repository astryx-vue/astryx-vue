import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import showcaseDemo from './showcase.vue'
import showcaseSource from './showcase.vue?raw&highlighted'

const options = { className: 'tab-menu-preview' }

export const tabMenuBasic = defineDemo(basicDemo, basicSource, options)
export const tabMenuShowcase = defineDemo(showcaseDemo, showcaseSource, options)
export const tabMenuOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
