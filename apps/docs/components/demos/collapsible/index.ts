import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import chevronPositionDemo from './chevron-position.vue'
import chevronPositionSource from './chevron-position.vue?raw&highlighted'
import controlledDemo from './controlled.vue'
import controlledSource from './controlled.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import dividersDemo from './dividers.vue'
import dividersSource from './dividers.vue?raw&highlighted'
import faqDemo from './faq.vue'
import faqSource from './faq.vue?raw&highlighted'
import multipleDemo from './multiple.vue'
import multipleSource from './multiple.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import singleDemo from './single.vue'
import singleSource from './single.vue?raw&highlighted'

const options = { className: 'collapsible-preview' }

export const collapsibleBasic = defineDemo(basicDemo, basicSource, options)
export const collapsibleControlled = defineDemo(controlledDemo, controlledSource, options)
export const collapsibleDividers = defineDemo(dividersDemo, dividersSource, options)
export const collapsibleFaq = defineDemo(faqDemo, faqSource, options)
export const collapsibleMultiple = defineDemo(multipleDemo, multipleSource, options)
export const collapsibleSingle = defineDemo(singleDemo, singleSource, options)
export const collapsibleChevronPosition = defineDemo(chevronPositionDemo, chevronPositionSource, options)
export const collapsibleDisabled = defineDemo(disabledDemo, disabledSource, options)

export const collapsibleOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
