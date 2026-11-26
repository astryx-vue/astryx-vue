import { defineDemo } from '../../demo-infra/defineDemo'
import filterStripDemo from './filter-strip.vue'
import filterStripSource from './filter-strip.vue?raw&highlighted'

export const useScrollOverflowFilterStrip = defineDemo(filterStripDemo, filterStripSource)
