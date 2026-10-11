import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'

export const navMenuBasic = defineDemo(basicDemo, basicSource, {
  className: 'nav-menu-preview',
})
