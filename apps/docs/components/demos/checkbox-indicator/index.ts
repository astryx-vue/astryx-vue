import { defineDemo } from '../../demo-infra/defineDemo'
import cycleDemo from './cycle.vue'
import cycleSource from './cycle.vue?raw&highlighted'
import loadingDemo from './loading.vue'
import loadingSource from './loading.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './states.vue'
import sizesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const checkboxIndicatorOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const checkboxIndicatorStates = defineDemo(cycleDemo, cycleSource, options)
export const checkboxIndicatorSizes = defineDemo(sizesDemo, sizesSource, options)
export const checkboxIndicatorLoading = defineDemo(loadingDemo, loadingSource, options)
