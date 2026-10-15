import { defineDemo } from '../../demo-infra/defineDemo'
import bareDemo from './bare.vue'
import bareSource from './bare.vue?raw&highlighted'
import helperDemo from './helper.vue'
import helperSource from './helper.vue?raw&highlighted'
import limitedDemo from './limited.vue'
import limitedSource from './limited.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import searchDemo from './search.vue'
import searchSource from './search.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

export const typeaheadOverview = defineDemo(overviewDemo, overviewSource)
export const typeaheadLimited = defineDemo(limitedDemo, limitedSource)
export const typeaheadSearch = defineDemo(searchDemo, searchSource)
export const typeaheadHelper = defineDemo(helperDemo, helperSource)
export const typeaheadValidation = defineDemo(validationDemo, validationSource)
export const typeaheadBare = defineDemo(bareDemo, bareSource)
