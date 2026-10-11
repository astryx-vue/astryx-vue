import { defineDemo } from '../../demo-infra/defineDemo'
import citedDemo from './cited.vue'
import citedSource from './cited.vue?raw&highlighted'
import compactDemo from './compact.vue'
import compactSource from './compact.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import richDemo from './rich.vue'
import richSource from './rich.vue?raw&highlighted'
import tableDemo from './table.vue'
import tableSource from './table.vue?raw&highlighted'

const options = { className: 'markdown-example' }

export const markdownOverview = defineDemo(overviewDemo, overviewSource, { className: 'markdown-overview' })
export const markdownCited = defineDemo(citedDemo, citedSource, options)
export const markdownCompact = defineDemo(compactDemo, compactSource, options)
export const markdownTable = defineDemo(tableDemo, tableSource, options)
export const markdownRich = defineDemo(richDemo, richSource, options)
