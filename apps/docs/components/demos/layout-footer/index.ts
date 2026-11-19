import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const layoutFooterActions = defineDemo(actionsDemo, actionsSource, { className: 'layout-footer-preview' })
export const layoutFooterOverview = defineDemo(overviewDemo, overviewSource)
