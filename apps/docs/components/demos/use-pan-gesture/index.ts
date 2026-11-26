import { defineDemo } from '../../demo-infra/defineDemo'
import followCardDemo from './follow-card.vue'
import followCardSource from './follow-card.vue?raw&highlighted'

export const usePanGestureFollowCard = defineDemo(followCardDemo, followCardSource)
