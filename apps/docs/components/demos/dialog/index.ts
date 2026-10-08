import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import fullscreenDemo from './fullscreen.vue'
import fullscreenSource from './fullscreen.vue?raw&highlighted'
import imperativeDemo from './imperative.vue'
import imperativeSource from './imperative.vue?raw&highlighted'
import requiredDemo from './required.vue'
import requiredSource from './required.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const dialogBasic = defineDemo(basicDemo, basicSource, options)
export const dialogForm = defineDemo(formDemo, formSource, options)
export const dialogRequired = defineDemo(requiredDemo, requiredSource, options)
export const dialogFullscreen = defineDemo(fullscreenDemo, fullscreenSource, options)
export const dialogImperative = defineDemo(imperativeDemo, imperativeSource, options)
