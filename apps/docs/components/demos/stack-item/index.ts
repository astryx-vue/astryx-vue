import { defineDemo } from '../../demo-infra/defineDemo'
import fillDemo from './fill.vue'
import fillSource from './fill.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'stack-item-preview' }

export const stackItemFill = defineDemo(fillDemo, fillSource, options)
export const stackItemOverview = defineDemo(overviewDemo, overviewSource, options)
