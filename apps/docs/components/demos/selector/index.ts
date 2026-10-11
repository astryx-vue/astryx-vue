import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import searchableDemo from './searchable.vue'
import searchableSource from './searchable.vue?raw&highlighted'
import clearableDemo from './clearable.vue'
import clearableSource from './clearable.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const selectorBasic = defineDemo(basicDemo, basicSource)
export const selectorSearchable = defineDemo(searchableDemo, searchableSource)
export const selectorClearable = defineDemo(clearableDemo, clearableSource)
export const selectorSizes = defineDemo(sizesDemo, sizesSource)
