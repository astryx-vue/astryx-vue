import { defineDemo } from '../../demo-infra/defineDemo'
import descriptionDemo from './description.vue'
import descriptionSource from './description.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import requiredDemo from './required.vue'
import requiredSource from './required.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const fieldRequired = defineDemo(requiredDemo, requiredSource, options)
export const fieldValidation = defineDemo(validationDemo, validationSource, options)
export const fieldDescription = defineDemo(descriptionDemo, descriptionSource, options)

export const fieldOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
