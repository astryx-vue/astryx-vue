import { defineDemo } from '../../demo-infra/defineDemo'
import actionBarDemo from './action-bar.vue'
import actionBarSource from './action-bar.vue?raw&highlighted'
import hookDemo from './hook.vue'
import hookSource from './hook.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const tooltipActionBar = defineDemo(actionBarDemo, actionBarSource, options)
export const tooltipHook = defineDemo(hookDemo, hookSource, options)
export const tooltipInline = defineDemo(inlineDemo, inlineSource, options)
export const tooltipOverview = defineDemo(overviewDemo, overviewSource, options)
