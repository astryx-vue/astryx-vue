import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import panelViewDemo from './panel-view.vue'
import panelViewSource from './panel-view.vue?raw&highlighted'

export const chatLayoutOverview = defineDemo(overviewDemo, overviewSource, { className: 'chat-layout-preview' })
export const chatLayoutPanelView = defineDemo(panelViewDemo, panelViewSource, { className: 'chat-preview' })
