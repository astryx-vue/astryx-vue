import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import directionsDemo from './directions.vue'
import directionsSource from './directions.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import marksDemo from './marks.vue'
import marksSource from './marks.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rangeDemo from './range.vue'
import rangeSource from './range.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const sliderBasic = defineDemo(basicDemo, basicSource, options)
export const sliderRange = defineDemo(rangeDemo, rangeSource, options)
export const sliderMarks = defineDemo(marksDemo, marksSource, options)
export const sliderStates = defineDemo(statesDemo, statesSource, options)
export const sliderDirections = defineDemo(directionsDemo, directionsSource, options)
export const sliderForm = defineDemo(formDemo, formSource, options)

export const sliderOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
