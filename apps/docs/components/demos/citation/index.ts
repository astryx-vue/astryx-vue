import { defineDemo } from '../../demo-infra/defineDemo'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sourcesDemo from './sources.vue'
import sourcesSource from './sources.vue?raw&highlighted'

const options = { className: 'citation-preview' }

export const citationOverview = defineDemo(overviewDemo, overviewSource, { className: 'citation-overview' })
export const citationInline = defineDemo(inlineDemo, inlineSource, options)
export const citationSources = defineDemo(sourcesDemo, sourcesSource, options)
