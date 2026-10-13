import { defineDemo } from '../../demo-infra/defineDemo'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sidebarDemo from './sidebar.vue'
import sidebarSource from './sidebar.vue?raw&highlighted'

export const resizeHandleHorizontal = defineDemo(horizontalDemo, horizontalSource, { className: 'resize-preview' })
export const resizeHandleSidebar = defineDemo(sidebarDemo, sidebarSource, { className: 'resize-preview' })
export const resizeHandleOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
