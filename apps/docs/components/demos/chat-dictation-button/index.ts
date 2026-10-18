import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const shell = { className: 'chat-preview-composer' }

export const chatDictationButtonOverview = defineDemo(overviewDemo, overviewSource, shell)
export const chatDictationButtonBasic = defineDemo(basicDemo, basicSource, shell)
