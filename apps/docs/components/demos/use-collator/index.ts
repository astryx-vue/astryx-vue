import { defineDemo } from '../../demo-infra/defineDemo'
import nameSortDemo from './name-sort.vue'
import nameSortSource from './name-sort.vue?raw&highlighted'

export const useCollatorNameSort = defineDemo(nameSortDemo, nameSortSource)
