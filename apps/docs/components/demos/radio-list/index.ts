import { defineDemo } from '../../demo-infra/defineDemo'
import descriptionsDemo from './descriptions.vue'
import descriptionsSource from './descriptions.vue?raw&highlighted'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import pricingDemo from './pricing.vue'
import pricingSource from './pricing.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

export const radioListHorizontal = defineDemo(horizontalDemo, horizontalSource)
export const radioListPricing = defineDemo(pricingDemo, pricingSource)
export const radioListDescriptions = defineDemo(descriptionsDemo, descriptionsSource)
export const radioListValidation = defineDemo(validationDemo, validationSource)
export const radioListOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
