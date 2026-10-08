import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import chevronPositionDemo from './chevron-position.vue'
import chevronPositionSource from './chevron-position.vue?raw&highlighted'
import controlledDemo from './controlled.vue'
import controlledSource from './controlled.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'

const options = { className: 'collapsible-preview' }

export const collapsibleBasic = defineDemo(basicDemo, basicSource, options)
export const collapsibleControlled = defineDemo(controlledDemo, controlledSource, options)
export const collapsibleChevronPosition = defineDemo(chevronPositionDemo, chevronPositionSource, options)
export const collapsibleDisabled = defineDemo(disabledDemo, disabledSource, options)
