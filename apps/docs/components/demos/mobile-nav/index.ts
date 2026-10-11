import { defineDemo } from '../../demo-infra/defineDemo'
import drawerDemo from './drawer.vue'
import drawerSource from './drawer.vue?raw&highlighted'
import endDemo from './end.vue'
import endSource from './end.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import untitledDemo from './untitled.vue'
import untitledSource from './untitled.vue?raw&highlighted'

export const mobileNavDrawer = defineDemo(drawerDemo, drawerSource)
export const mobileNavEnd = defineDemo(endDemo, endSource)
export const mobileNavUntitled = defineDemo(untitledDemo, untitledSource)
export const mobileNavOverview = defineDemo(overviewDemo, overviewSource)
