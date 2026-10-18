import { defineDemo } from '../../demo-infra/defineDemo'
import customResultsDemo from './custom-results.vue'
import customResultsSource from './custom-results.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const baseTypeaheadCustomResults = defineDemo(customResultsDemo, customResultsSource)
export const baseTypeaheadOverview = defineDemo(overviewDemo, overviewSource)
