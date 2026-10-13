import { defineDemo } from '../../demo-infra/defineDemo'
import cardDemo from './card.vue'
import cardSource from './card.vue?raw&highlighted'
import listDemo from './list.vue'
import listSource from './list.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import tableDemo from './table.vue'
import tableSource from './table.vue?raw&highlighted'

const options = { className: 'skeleton-preview' }

export const skeletonCard = defineDemo(cardDemo, cardSource, options)
export const skeletonList = defineDemo(listDemo, listSource, options)
export const skeletonTable = defineDemo(tableDemo, tableSource, options)
export const skeletonOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
