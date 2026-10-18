import { defineDemo } from '../../demo-infra/defineDemo'
import labelsDemo from './labels.vue'
import labelsSource from './labels.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const column = { className: 'chat-preview-stack chat-preview-stack--center' }

export const chatLayoutScrollButtonOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatLayoutScrollButtonLabels = defineDemo(labelsDemo, labelsSource, column)
