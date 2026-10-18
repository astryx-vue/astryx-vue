import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'layout-footer-preview' }

export const layoutFooterActions = defineDemo(actionsDemo, actionsSource, options)
export const layoutFooterOverview = defineDemo(overviewDemo, overviewSource, options)
