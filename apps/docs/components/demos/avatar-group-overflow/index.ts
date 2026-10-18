import { defineDemo } from '../../demo-infra/defineDemo'
import customTextDemo from './custom-text.vue'
import customTextSource from './custom-text.vue?raw&highlighted'
import defaultCountDemo from './default-count.vue'
import defaultCountSource from './default-count.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'overview-hug' }

export const avatarGroupOverflowCustomText = defineDemo(customTextDemo, customTextSource, options)
export const avatarGroupOverflowDefaultCount = defineDemo(defaultCountDemo, defaultCountSource, options)
export const avatarGroupOverflowOverview = defineDemo(overviewDemo, overviewSource, options)
