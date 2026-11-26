import { defineDemo } from '../../demo-infra/defineDemo'
import searchFieldDemo from './search-field.vue'
import searchFieldSource from './search-field.vue?raw&highlighted'

export const useInputContainerSearchField = defineDemo(searchFieldDemo, searchFieldSource)
