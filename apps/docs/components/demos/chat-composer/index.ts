import { defineDemo } from '../../demo-infra/defineDemo'
import attachmentsDemo from './attachments.vue'
import attachmentsSource from './attachments.vue?raw&highlighted'
import flatDemo from './flat.vue'
import flatSource from './flat.vue?raw&highlighted'
import footerActionsDemo from './footer-actions.vue'
import footerActionsSource from './footer-actions.vue?raw&highlighted'
import fullFeaturedDemo from './full-featured.vue'
import fullFeaturedSource from './full-featured.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import simpleDemo from './simple.vue'
import simpleSource from './simple.vue?raw&highlighted'
import streamingDemo from './streaming.vue'
import streamingSource from './streaming.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const shell = { className: 'chat-preview-composer' }

export const chatComposerOverview = defineDemo(overviewDemo, overviewSource, shell)
export const chatComposerAttachments = defineDemo(attachmentsDemo, attachmentsSource, shell)
export const chatComposerFlat = defineDemo(flatDemo, flatSource, shell)
export const chatComposerFooterActions = defineDemo(footerActionsDemo, footerActionsSource, shell)
export const chatComposerFullFeatured = defineDemo(fullFeaturedDemo, fullFeaturedSource, shell)
export const chatComposerSimple = defineDemo(simpleDemo, simpleSource, shell)
export const chatComposerStreaming = defineDemo(streamingDemo, streamingSource, shell)
export const chatComposerValidation = defineDemo(validationDemo, validationSource, shell)
