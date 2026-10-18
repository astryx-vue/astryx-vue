import { defineDemo } from '../../demo-infra/defineDemo'
import columnsDemo from './columns.vue'
import columnsSource from './columns.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'grid-span-preview' }

export const gridSpanColumns = defineDemo(columnsDemo, columnsSource, options)
export const gridSpanOverview = defineDemo(overviewDemo, overviewSource, options)
