import { defineDemo } from '../../demo-infra/defineDemo'
import searchHelpDemo from './search-help.vue'
import searchHelpSource from './search-help.vue?raw&highlighted'

export const useHotkeysSearchHelp = defineDemo(searchHelpDemo, searchHelpSource)
