import { defineDemo } from '../../demo-infra/defineDemo'
import overflowDemo from './overflow.vue'
import overflowSource from './overflow.vue?raw&highlighted'

export const toolbarOverflow = defineDemo(overflowDemo, overflowSource, {
  className: 'toolbar-preview',
})
