import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'size-context-preview' }

export const sizeContextOverview = defineDemo(overviewDemo, overviewSource, options)
