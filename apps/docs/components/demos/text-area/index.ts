import { defineDemo } from '../../demo-infra/defineDemo'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rowsDemo from './rows.vue'
import rowsSource from './rows.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const textAreaBasic = defineDemo(basicDemo, basicSource, options)
export const textAreaSizes = defineDemo(sizesDemo, sizesSource, options)
export const textAreaRows = defineDemo(rowsDemo, rowsSource, options)
export const textAreaStates = defineDemo(statesDemo, statesSource, options)
export const textAreaValidation = defineDemo(validationDemo, validationSource, options)
export const textAreaAsync = defineDemo(asyncDemo, asyncSource, options)

export const textAreaOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
