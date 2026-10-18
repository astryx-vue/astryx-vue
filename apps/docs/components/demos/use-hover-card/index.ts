import { defineDemo } from '../../demo-infra/defineDemo'
import hoverCardDemo from './use-hover-card.vue'
import hoverCardSource from './use-hover-card.vue?raw&highlighted'

export const useHoverCardProfile = defineDemo(hoverCardDemo, hoverCardSource)
