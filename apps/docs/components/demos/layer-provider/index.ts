import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'layer-provider-preview' }

export const layerProviderOverview = defineDemo(overviewDemo, overviewSource, options)
