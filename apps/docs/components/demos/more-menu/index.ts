import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import bottomSheetDemo from './bottom-sheet.vue'
import bottomSheetSource from './bottom-sheet.vue?raw&highlighted'
import dividersDemo from './dividers.vue'
import dividersSource from './dividers.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sectionsDemo from './sections.vue'
import sectionsSource from './sections.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import triggersDemo from './triggers.vue'
import triggersSource from './triggers.vue?raw&highlighted'

const options = { className: 'more-menu-preview' }

export const moreMenuOverview = defineDemo(overviewDemo, overviewSource, options)
export const moreMenuBottomSheet = defineDemo(bottomSheetDemo, bottomSheetSource, options)
export const moreMenuBasic = defineDemo(basicDemo, basicSource, options)
export const moreMenuDividers = defineDemo(dividersDemo, dividersSource, options)
export const moreMenuSections = defineDemo(sectionsDemo, sectionsSource, options)
export const moreMenuSizes = defineDemo(sizesDemo, sizesSource, options)
export const moreMenuTriggers = defineDemo(triggersDemo, triggersSource, options)
