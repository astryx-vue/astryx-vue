import { defineDemo } from '../../demo-infra/defineDemo'
import customFormatDemo from './custom-format.vue'
import customFormatSource from './custom-format.vue?raw&highlighted'
import indeterminateDemo from './indeterminate.vue'
import indeterminateSource from './indeterminate.vue?raw&highlighted'
import marksDemo from './marks.vue'
import marksSource from './marks.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import semanticDemo from './semantic.vue'
import semanticSource from './semantic.vue?raw&highlighted'
import valueLabelDemo from './value-label.vue'
import valueLabelSource from './value-label.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const progressBarCustomFormat = defineDemo(customFormatDemo, customFormatSource, options)
export const progressBarIndeterminate = defineDemo(indeterminateDemo, indeterminateSource, options)
export const progressBarMarks = defineDemo(marksDemo, marksSource, options)
export const progressBarSemantic = defineDemo(semanticDemo, semanticSource, options)
export const progressBarValueLabel = defineDemo(valueLabelDemo, valueLabelSource, options)
export const progressBarOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
