import { defineDemo } from '../../demo-infra/defineDemo'
import alignmentDemo from './alignment.vue'
import alignmentSource from './alignment.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import columnsDemo from './columns.vue'
import columnsSource from './columns.vue?raw&highlighted'
import spanDemo from './span.vue'
import spanSource from './span.vue?raw&highlighted'

const options = { className: 'grid-preview' }

export const gridBasic = defineDemo(basicDemo, basicSource, options)
export const gridColumns = defineDemo(columnsDemo, columnsSource, options)
export const gridSpan = defineDemo(spanDemo, spanSource, options)
export const gridAlignment = defineDemo(alignmentDemo, alignmentSource, options)
