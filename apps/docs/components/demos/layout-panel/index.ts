import { defineDemo } from '../../demo-infra/defineDemo'
import navigationDemo from './navigation.vue'
import navigationSource from './navigation.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const layoutPanelNavigation = defineDemo(navigationDemo, navigationSource, { className: 'layout-panel-preview' })
export const layoutPanelOverview = defineDemo(overviewDemo, overviewSource)
