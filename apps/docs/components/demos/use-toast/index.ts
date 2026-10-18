import { defineDemo } from '../../demo-infra/defineDemo'
import showDemo from './show.vue'
import showSource from './show.vue?raw&highlighted'

export const useToastShow = defineDemo(showDemo, showSource, { className: 'toast-preview' })
