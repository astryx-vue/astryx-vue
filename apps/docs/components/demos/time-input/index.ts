import { defineDemo } from '../../demo-infra/defineDemo'
import constrainedDemo from './constrained.vue'
import constrainedSource from './constrained.vue?raw&highlighted'
import formatsDemo from './formats.vue'
import formatsSource from './formats.vue?raw&highlighted'
import incrementDemo from './increment.vue'
import incrementSource from './increment.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sheetDemo from './sheet.vue'
import sheetSource from './sheet.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

export const timeInputConstrained = defineDemo(constrainedDemo, constrainedSource)
export const timeInputFormats = defineDemo(formatsDemo, formatsSource)
export const timeInputIncrement = defineDemo(incrementDemo, incrementSource)
export const timeInputStates = defineDemo(statesDemo, statesSource)
export const timeInputSheet = defineDemo(sheetDemo, sheetSource)
export const timeInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
