import { defineDemo } from '../../demo-infra/defineDemo'
import loadingDemo from './loading.vue'
import loadingSource from './loading.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import replaceDemo from './replace.vue'
import replaceSource from './replace.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const indicatorOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const indicatorStates = defineDemo(statesDemo, statesSource, options)
export const indicatorReplace = defineDemo(replaceDemo, replaceSource, options)
export const indicatorLoading = defineDemo(loadingDemo, loadingSource, options)
