import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

export const dateTimeInputValidation = defineDemo(validationDemo, validationSource, { className: 'date-preview-host' })
export const dateTimeInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
