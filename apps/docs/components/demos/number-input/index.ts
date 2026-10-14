import { defineDemo } from '../../demo-infra/defineDemo'
import clearableDemo from './clearable.vue'
import clearableSource from './clearable.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rangeDemo from './range.vue'
import rangeSource from './range.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import unitsDemo from './units.vue'
import unitsSource from './units.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const numberInputClearable = defineDemo(clearableDemo, clearableSource, options)
export const numberInputRange = defineDemo(rangeDemo, rangeSource, options)
export const numberInputStatus = defineDemo(statusDemo, statusSource, options)
export const numberInputUnits = defineDemo(unitsDemo, unitsSource, options)

export const numberInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
