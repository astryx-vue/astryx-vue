import { defineDemo } from '../../demo-infra/defineDemo'
import countryListDemo from './country-list.vue'
import countryListSource from './country-list.vue?raw&highlighted'

export const useTypeaheadCountryList = defineDemo(countryListDemo, countryListSource)
