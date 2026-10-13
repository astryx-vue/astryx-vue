import { defineDemo } from '../../demo-infra/defineDemo'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import headingLevelsDemo from './heading-levels.vue'
import headingLevelsSource from './heading-levels.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import truncationDemo from './truncation.vue'
import truncationSource from './truncation.vue?raw&highlighted'
import typesDemo from './types.vue'
import typesSource from './types.vue?raw&highlighted'
import weightDemo from './weight.vue'
import weightSource from './weight.vue?raw&highlighted'
import wordBreakDemo from './word-break.vue'
import wordBreakSource from './word-break.vue?raw&highlighted'
import wrapDemo from './wrap.vue'
import wrapSource from './wrap.vue?raw&highlighted'

const options = { className: 'text-preview' }

export const textColors = defineDemo(colorsDemo, colorsSource, options)
export const textHeadingLevels = defineDemo(headingLevelsDemo, headingLevelsSource, options)
export const textInline = defineDemo(inlineDemo, inlineSource, options)
export const textTruncation = defineDemo(truncationDemo, truncationSource, options)
export const textTypes = defineDemo(typesDemo, typesSource, options)
export const textWeight = defineDemo(weightDemo, weightSource, options)
export const textWordBreak = defineDemo(wordBreakDemo, wordBreakSource, options)
export const textWrap = defineDemo(wrapDemo, wrapSource, options)
export const textOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
