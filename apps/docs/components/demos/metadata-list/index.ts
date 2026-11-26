import { defineDemo } from '../../demo-infra/defineDemo'
import collapsibleDemo from './collapsible.vue'
import collapsibleSource from './collapsible.vue?raw&highlighted'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import multiColumnDemo from './multi-column.vue'
import multiColumnSource from './multi-column.vue?raw&highlighted'
import basicDemo from './overview.vue'
import overviewDemo from './overview.vue'
import basicSource from './overview.vue?raw&highlighted'
import overviewSource from './overview.vue?raw&highlighted'

export const metadataListOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const metadataListBasic = defineDemo(basicDemo, basicSource)
export const metadataListCollapsible = defineDemo(collapsibleDemo, collapsibleSource)
export const metadataListHorizontal = defineDemo(horizontalDemo, horizontalSource)
export const metadataListMultiColumn = defineDemo(multiColumnDemo, multiColumnSource)
