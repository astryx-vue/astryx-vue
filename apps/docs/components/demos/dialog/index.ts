import { defineDemo } from '../../demo-infra/defineDemo'
import adaptiveDemo from './adaptive.vue'
import adaptiveSource from './adaptive.vue?raw&highlighted'
import confirmationDemo from './confirmation.vue'
import confirmationSource from './confirmation.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import fullscreenDemo from './fullscreen.vue'
import fullscreenSource from './fullscreen.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import requiredDemo from './required.vue'
import requiredSource from './required.vue?raw&highlighted'
import scrollableDemo from './scrollable.vue'
import scrollableSource from './scrollable.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const dialogAdaptive = defineDemo(adaptiveDemo, adaptiveSource, options)
export const dialogConfirmation = defineDemo(confirmationDemo, confirmationSource, options)
export const dialogForm = defineDemo(formDemo, formSource, options)
export const dialogFullscreen = defineDemo(fullscreenDemo, fullscreenSource, options)
export const dialogScrollable = defineDemo(scrollableDemo, scrollableSource, options)
export const dialogRequired = defineDemo(requiredDemo, requiredSource, options)
export const dialogOverview = defineDemo(overviewDemo, overviewSource, options)
