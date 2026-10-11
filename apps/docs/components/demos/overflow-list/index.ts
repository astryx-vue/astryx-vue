import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'

export const overflowListBasic = defineDemo(basicDemo, basicSource, {
  className: 'overflow-list-preview',
})
