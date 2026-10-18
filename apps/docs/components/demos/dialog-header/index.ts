import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const dialogHeaderBasic = defineDemo(basicDemo, basicSource, options)
export const dialogHeaderOverview = defineDemo(overviewDemo, overviewSource, options)
