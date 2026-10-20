import { defineDemo } from '../../demo-infra/defineDemo'
import layerDemo from './use-layer.vue'
import layerSource from './use-layer.vue?raw&highlighted'

export const useLayerAnchored = defineDemo(layerDemo, layerSource)
