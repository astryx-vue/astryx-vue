import { defineDemo } from '../../demo-infra/defineDemo'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import passwordDemo from './password.vue'
import passwordSource from './password.vue?raw&highlighted'
import searchDemo from './search.vue'
import searchSource from './search.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const textInputBasic = defineDemo(basicDemo, basicSource, options)
export const textInputSizes = defineDemo(sizesDemo, sizesSource, options)
export const textInputSearch = defineDemo(searchDemo, searchSource, options)
export const textInputPassword = defineDemo(passwordDemo, passwordSource, options)
export const textInputStates = defineDemo(statesDemo, statesSource, options)
export const textInputValidation = defineDemo(validationDemo, validationSource, options)
export const textInputAsync = defineDemo(asyncDemo, asyncSource, options)

export const textInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
