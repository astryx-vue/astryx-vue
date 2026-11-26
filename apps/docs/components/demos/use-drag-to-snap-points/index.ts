import { defineDemo } from '../../demo-infra/defineDemo'
import drawerDemo from './drawer.vue'
import drawerSource from './drawer.vue?raw&highlighted'

export const useDragToSnapPointsDrawer = defineDemo(drawerDemo, drawerSource)
