import { defineDemo } from '../../demo-infra/defineDemo'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusUpdatesDemo from './status-updates.vue'
import statusUpdatesSource from './status-updates.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const column = { className: 'chat-preview' }
const narrow = { className: 'chat-preview-system' }
const wide = { className: 'chat-preview-wide' }

export const chatSystemMessageOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatSystemMessageIcon = defineDemo(iconDemo, iconSource, column)
export const chatSystemMessageStatusUpdates = defineDemo(statusUpdatesDemo, statusUpdatesSource, narrow)
export const chatSystemMessageVariants = defineDemo(variantsDemo, variantsSource, wide)
