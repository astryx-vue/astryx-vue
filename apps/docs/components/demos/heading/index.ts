import { defineDemo } from '../../demo-infra/defineDemo'
import cardGridDemo from './card-grid.vue'
import cardGridSource from './card-grid.vue?raw&highlighted'
import hierarchyDemo from './hierarchy.vue'
import hierarchySource from './hierarchy.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import truncationDemo from './truncation.vue'
import truncationSource from './truncation.vue?raw&highlighted'

const options = { className: 'heading-preview' }

export const headingCardGrid = defineDemo(cardGridDemo, cardGridSource, options)
export const headingHierarchy = defineDemo(hierarchyDemo, hierarchySource, options)
export const headingTruncation = defineDemo(truncationDemo, truncationSource, options)
export const headingOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
