import { defineDemo } from '../../demo-infra/defineDemo'
import drawerDemo from './drawer.vue'
import drawerSource from './drawer.vue?raw&highlighted'

export const mobileNavDrawer = defineDemo(drawerDemo, drawerSource, {
  className: 'mobile-nav-preview',
})
