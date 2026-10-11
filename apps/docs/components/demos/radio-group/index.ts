import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const radioGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
