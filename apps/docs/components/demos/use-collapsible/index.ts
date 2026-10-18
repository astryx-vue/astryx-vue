import { defineDemo } from '../../demo-infra/defineDemo'
import collapsibleDemo from './use-collapsible.vue'
import collapsibleSource from './use-collapsible.vue?raw&highlighted'

export const useCollapsibleCustom = defineDemo(collapsibleDemo, collapsibleSource)
