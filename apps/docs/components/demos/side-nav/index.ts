import { defineDemo } from '../../demo-infra/defineDemo'
import collapseDemo from './collapse.vue'
import collapseSource from './collapse.vue?raw&highlighted'

export const sideNavCollapse = defineDemo(collapseDemo, collapseSource, {
  className: 'side-nav-preview',
})
