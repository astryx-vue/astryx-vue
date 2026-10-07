import { defineDemo } from '../../demo-infra/defineDemo'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import indeterminateDemo from './indeterminate.vue'
import indeterminateSource from './indeterminate.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const checkboxInputBasic = defineDemo(basicDemo, basicSource, options)
export const checkboxInputSizes = defineDemo(sizesDemo, sizesSource, options)
export const checkboxInputIndeterminate = defineDemo(indeterminateDemo, indeterminateSource, options)
export const checkboxInputStates = defineDemo(statesDemo, statesSource, options)
export const checkboxInputForm = defineDemo(formDemo, formSource, options)
export const checkboxInputAsync = defineDemo(asyncDemo, asyncSource, options)
