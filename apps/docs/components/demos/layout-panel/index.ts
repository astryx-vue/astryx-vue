import { defineDemo } from '../../demo-infra/defineDemo'
import navigationDemo from './navigation.vue'
import navigationSource from './navigation.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'layout-panel-preview' }

export const layoutPanelNavigation = defineDemo(navigationDemo, navigationSource, options)
export const layoutPanelOverview = defineDemo(overviewDemo, overviewSource, options)
