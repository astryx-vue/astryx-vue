import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'

export const navItemBasic = defineDemo(basicDemo, basicSource, {
  className: 'nav-item-preview',
})
