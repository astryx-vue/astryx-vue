import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import collapsibleDemo from './collapsible.vue'
import collapsibleSource from './collapsible.vue?raw&highlighted'
import dismissDemo from './dismiss.vue'
import dismissSource from './dismiss.vue?raw&highlighted'
import floatingDemo from './floating.vue'
import floatingSource from './floating.vue?raw&highlighted'
import fullWidthDemo from './full-width.vue'
import fullWidthSource from './full-width.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusesDemo from './statuses.vue'
import statusesSource from './statuses.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const bannerAction = defineDemo(actionsDemo, actionsSource, options)
export const bannerCollapsible = defineDemo(collapsibleDemo, collapsibleSource, options)
export const bannerDismiss = defineDemo(dismissDemo, dismissSource, options)
export const bannerFloating = defineDemo(floatingDemo, floatingSource, options)
export const bannerFullWidth = defineDemo(fullWidthDemo, fullWidthSource, options)
export const bannerStatuses = defineDemo(statusesDemo, statusesSource, options)
export const bannerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
