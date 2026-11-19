import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import withActionsDemo from './with-actions.vue'
import withActionsSource from './with-actions.vue?raw&highlighted'

export const layoutHeaderWithActions = defineDemo(withActionsDemo, withActionsSource, { className: 'layout-header-preview' })
export const layoutHeaderOverview = defineDemo(overviewDemo, overviewSource)
