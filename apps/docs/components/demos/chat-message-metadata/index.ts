import { defineDemo } from '../../demo-infra/defineDemo'
import footerActionsDemo from './footer-actions.vue'
import footerActionsSource from './footer-actions.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import timestampsDemo from './timestamps.vue'
import timestampsSource from './timestamps.vue?raw&highlighted'

const column = { className: 'chat-preview' }

export const chatMessageMetadataOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatMessageMetadataFooterActions = defineDemo(footerActionsDemo, footerActionsSource, column)
export const chatMessageMetadataStatus = defineDemo(statusDemo, statusSource, column)
export const chatMessageMetadataTimestamps = defineDemo(timestampsDemo, timestampsSource, column)
