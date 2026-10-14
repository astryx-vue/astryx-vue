import { defineDemo } from '../../demo-infra/defineDemo'
import loadingDemo from '../checkbox-indicator/loading.vue'
import loadingSource from '../checkbox-indicator/loading.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import replaceDemo from './replace.vue'
import replaceSource from './replace.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const checkIndicatorOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const checkIndicatorStates = defineDemo(statesDemo, statesSource, options)
export const checkIndicatorReplace = defineDemo(replaceDemo, replaceSource, options)
export const checkIndicatorLoading = defineDemo(loadingDemo, loadingSource, options)
