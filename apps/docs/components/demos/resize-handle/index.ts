import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sidebarDemo from './sidebar.vue'
import sidebarSource from './sidebar.vue?raw&highlighted'

export const resizeHandleSidebar = defineDemo(sidebarDemo, sidebarSource, { className: 'resize-preview' })
export const resizeHandleOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
