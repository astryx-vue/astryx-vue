import { defineDemo } from '../../demo-infra/defineDemo'
import actionDemo from './action.vue'
import actionSource from './action.vue?raw&highlighted'
import dedupDemo from './dedup.vue'
import dedupSource from './dedup.vue?raw&highlighted'
import dismissDemo from './dismiss.vue'
import dismissSource from './dismiss.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import stackingDemo from './stacking.vue'
import stackingSource from './stacking.vue?raw&highlighted'
import typesDemo from './types.vue'
import typesSource from './types.vue?raw&highlighted'

const options = { className: 'toast-preview' }

export const toastOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
export const toastAction = defineDemo(actionDemo, actionSource, options)
export const toastDedup = defineDemo(dedupDemo, dedupSource, options)
export const toastDismiss = defineDemo(dismissDemo, dismissSource, options)
export const toastStacking = defineDemo(stackingDemo, stackingSource, options)
export const toastTypes = defineDemo(typesDemo, typesSource, options)
