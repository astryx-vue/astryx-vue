import { defineDemo } from '../../demo-infra/defineDemo'
import clearableDemo from './clearable.vue'
import clearableSource from './clearable.vue?raw&highlighted'
import descriptionDemo from './description.vue'
import descriptionSource from './description.vue?raw&highlighted'
import fieldDemo from './field.vue'
import fieldSource from './field.vue?raw&highlighted'
import formatsDemo from './formats.vue'
import formatsSource from './formats.vue?raw&highlighted'
import nativeDemo from './native.vue'
import nativeSource from './native.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rangeDemo from './range.vue'
import rangeSource from './range.vue?raw&highlighted'
import sheetDemo from './sheet.vue'
import sheetSource from './sheet.vue?raw&highlighted'
import validationDemo from './validation.vue'
import validationSource from './validation.vue?raw&highlighted'

const options = { className: 'date-preview-host' }
export const dateInputClearable = defineDemo(clearableDemo, clearableSource, options)
export const dateInputRange = defineDemo(rangeDemo, rangeSource, options)
export const dateInputFormats = defineDemo(formatsDemo, formatsSource, options)
export const dateInputField = defineDemo(fieldDemo, fieldSource, options)
export const dateInputNative = defineDemo(nativeDemo, nativeSource, options)
export const dateInputSheet = defineDemo(sheetDemo, sheetSource, options)
export const dateInputDescription = defineDemo(descriptionDemo, descriptionSource, options)
export const dateInputValidation = defineDemo(validationDemo, validationSource, options)

export const dateInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
