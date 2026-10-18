import { defineDemo } from '../../demo-infra/defineDemo'
import densityDemo from './density.vue'
import densitySource from './density.vue?raw&highlighted'
import fullFeaturedDemo from './full-featured.vue'
import fullFeaturedSource from './full-featured.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const column = { className: 'chat-preview' }
const wide = { className: 'chat-preview-wide' }

export const chatMessageListOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatMessageListDensity = defineDemo(densityDemo, densitySource, wide)
export const chatMessageListFullFeatured = defineDemo(fullFeaturedDemo, fullFeaturedSource, column)
