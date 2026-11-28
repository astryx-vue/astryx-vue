import { defineDemo } from '../../demo-infra/defineDemo'
import dragCardDemo from './drag-card.vue'
import dragCardSource from './drag-card.vue?raw&highlighted'

export const useAnimatorDragCard = defineDemo(dragCardDemo, dragCardSource)
