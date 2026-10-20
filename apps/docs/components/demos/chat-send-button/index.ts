import { defineDemo } from '../../demo-infra/defineDemo'
import customIconDemo from './custom-icon.vue'
import customIconSource from './custom-icon.vue?raw&highlighted'
import inComposerDemo from './in-composer.vue'
import inComposerSource from './in-composer.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const row = { className: 'chat-preview-stack chat-preview-stack--center' }
const composer = { className: 'chat-preview-composer' }

export const chatSendButtonOverview = defineDemo(overviewDemo, overviewSource, row)
export const chatSendButtonCustomIcon = defineDemo(customIconDemo, customIconSource, row)
export const chatSendButtonInComposer = defineDemo(inComposerDemo, inComposerSource, composer)
export const chatSendButtonStates = defineDemo(statesDemo, statesSource, row)
