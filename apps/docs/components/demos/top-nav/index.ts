import { defineDemo } from '../../demo-infra/defineDemo'
import megaDemo from './mega.vue'
import megaSource from './mega.vue?raw&highlighted'

export const topNavMega = defineDemo(megaDemo, megaSource, {
  className: 'top-nav-preview',
})
