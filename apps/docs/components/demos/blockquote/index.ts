import { defineDemo } from '../../demo-infra/defineDemo'
import citeDemo from './cite.vue'
import citeSource from './cite.vue?raw&highlighted'

export const blockquoteCite = defineDemo(citeDemo, citeSource, {
  className: 'blockquote-preview',
})
