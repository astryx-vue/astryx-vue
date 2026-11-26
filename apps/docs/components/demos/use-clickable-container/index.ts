import { defineDemo } from '../../demo-infra/defineDemo'
import projectCardDemo from './project-card.vue'
import projectCardSource from './project-card.vue?raw&highlighted'

export const useClickableContainerProjectCard = defineDemo(projectCardDemo, projectCardSource)
