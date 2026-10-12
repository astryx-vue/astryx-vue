import { defineDemo } from '../../demo-infra/defineDemo'
import accordionDemo from './accordion.vue'
import accordionSource from './accordion.vue?raw&highlighted'
import coordinatedDemo from './coordinated.vue'
import coordinatedSource from './coordinated.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'collapsible-group-preview' }

export const collapsibleGroupCoordinated = defineDemo(coordinatedDemo, coordinatedSource, options)
export const collapsibleGroupAccordion = defineDemo(accordionDemo, accordionSource, options)
export const collapsibleGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
