import { defineDemo } from '../../demo-infra/defineDemo'
import adaptiveDemo from './adaptive.vue'
import adaptiveSource from './adaptive.vue?raw&highlighted'

export const useMediaQueryAdaptive = defineDemo(adaptiveDemo, adaptiveSource)
