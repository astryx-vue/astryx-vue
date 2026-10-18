import { defineDemo } from '../../demo-infra/defineDemo'
import tooltipDemo from './use-tooltip.vue'
import tooltipSource from './use-tooltip.vue?raw&highlighted'

export const useTooltipHookUsage = defineDemo(tooltipDemo, tooltipSource)
