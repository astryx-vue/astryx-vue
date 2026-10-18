import { defineDemo } from '../../demo-infra/defineDemo'
import toolbarDemo from './toolbar.vue'
import toolbarSource from './toolbar.vue?raw&highlighted'

export const useKeyboardHintToolbar = defineDemo(toolbarDemo, toolbarSource)
