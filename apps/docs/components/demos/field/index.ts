import { defineDemo } from '../../demo-infra/defineDemo'
import customDemo from './custom.vue'
import customSource from './custom.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import primitivesDemo from './primitives.vue'
import primitivesSource from './primitives.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const fieldCustom = defineDemo(customDemo, customSource, options)
export const fieldPrimitives = defineDemo(primitivesDemo, primitivesSource, options)

export const fieldOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
