import { defineDemo } from '../../demo-infra/defineDemo'
import badgeDemo from './badge.vue'
import badgeSource from './badge.vue?raw&highlighted'
import customDemo from './custom.vue'
import customSource from './custom.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const row = { className: 'chat-preview-stack chat-preview-stack--center' }

export const chatComposerTokenElementOverview = defineDemo(overviewDemo, overviewSource, row)
export const chatComposerTokenElementBadge = defineDemo(badgeDemo, badgeSource, row)
export const chatComposerTokenElementCustom = defineDemo(customDemo, customSource, row)
