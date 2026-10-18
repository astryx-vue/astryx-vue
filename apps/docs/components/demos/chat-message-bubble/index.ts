import { defineDemo } from '../../demo-infra/defineDemo'
import customContentDemo from './custom-content.vue'
import customContentSource from './custom-content.vue?raw&highlighted'
import densityDemo from './density.vue'
import densitySource from './density.vue?raw&highlighted'
import groupingDemo from './grouping.vue'
import groupingSource from './grouping.vue?raw&highlighted'
import metadataDemo from './metadata.vue'
import metadataSource from './metadata.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const column = { className: 'chat-preview' }
const wide = { className: 'chat-preview-wide' }

export const chatMessageBubbleOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatMessageBubbleCustomContent = defineDemo(customContentDemo, customContentSource, column)
export const chatMessageBubbleDensity = defineDemo(densityDemo, densitySource, wide)
export const chatMessageBubbleGrouping = defineDemo(groupingDemo, groupingSource, column)
export const chatMessageBubbleMetadata = defineDemo(metadataDemo, metadataSource, column)
export const chatMessageBubbleVariants = defineDemo(variantsDemo, variantsSource, column)
