import { defineDemo } from '../../demo-infra/defineDemo'
import quickEditDemo from './quick-edit.vue'
import quickEditSource from './quick-edit.vue?raw&highlighted'

export const useFocusTrapQuickEdit = defineDemo(quickEditDemo, quickEditSource)
