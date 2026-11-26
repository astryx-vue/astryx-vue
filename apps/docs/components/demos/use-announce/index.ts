import { defineDemo } from '../../demo-infra/defineDemo'
import filterResultCountDemo from './filter-result-count.vue'
import filterResultCountSource from './filter-result-count.vue?raw&highlighted'

export const useAnnounceFilterResultCount = defineDemo(filterResultCountDemo, filterResultCountSource)
