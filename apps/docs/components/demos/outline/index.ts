import { defineDemo } from '../../demo-infra/defineDemo'
import controlledDemo from './controlled.vue'
import controlledSource from './controlled.vue?raw&highlighted'
import deepNestingDemo from './deep-nesting.vue'
import deepNestingSource from './deep-nesting.vue?raw&highlighted'
import densityDemo from './density.vue'
import densitySource from './density.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const outlineOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const outlineControlled = defineDemo(controlledDemo, controlledSource)
export const outlineDeepNesting = defineDemo(deepNestingDemo, deepNestingSource)
export const outlineDensity = defineDemo(densityDemo, densitySource)
