import { defineDemo } from '../../demo-infra/defineDemo'
import customTriggerDemo from '../app-shell/mobile-hook.vue'
import customTriggerSource from '../app-shell/mobile-hook.vue?raw&highlighted'

export const useAppShellMobileCustomTrigger = defineDemo(customTriggerDemo, customTriggerSource, { className: 'app-shell-preview' })
