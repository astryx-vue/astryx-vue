import { defineDemo } from '../../demo-infra/defineDemo'
import attachmentsDemo from './attachments.vue'
import attachmentsSource from './attachments.vue?raw&highlighted'
import collapsibleDemo from './collapsible.vue'
import collapsibleSource from './collapsible.vue?raw&highlighted'
import feedbackDemo from './feedback.vue'
import feedbackSource from './feedback.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import withProgressDemo from './with-progress.vue'
import withProgressSource from './with-progress.vue?raw&highlighted'

const shell = { className: 'chat-preview-composer' }

export const chatComposerDrawerOverview = defineDemo(overviewDemo, overviewSource, shell)
export const chatComposerDrawerAttachments = defineDemo(attachmentsDemo, attachmentsSource, shell)
export const chatComposerDrawerCollapsible = defineDemo(collapsibleDemo, collapsibleSource, shell)
export const chatComposerDrawerFeedback = defineDemo(feedbackDemo, feedbackSource, shell)
export const chatComposerDrawerWithProgress = defineDemo(withProgressDemo, withProgressSource, shell)
