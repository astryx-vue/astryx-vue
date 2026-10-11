import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import truncationDemo from './truncation.vue'
import truncationSource from './truncation.vue?raw&highlighted'
import typesDemo from './types.vue'
import typesSource from './types.vue?raw&highlighted'

export const textTypes = defineDemo(typesDemo, typesSource, {
  className: 'text-preview',
})

export const textTruncation = defineDemo(truncationDemo, truncationSource, {
  className: 'text-preview',
})

export const textOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
