import { defineDemo } from '../../demo-infra/defineDemo'
import deepDemo from './deep.vue'
import deepSource from './deep.vue?raw&highlighted'
import iconsDemo from './icons.vue'
import iconsSource from './icons.vue?raw&highlighted'
import menuSelectionDemo from './menu-selection.vue'
import menuSelectionSource from './menu-selection.vue?raw&highlighted'
import menuDemo from './menu.vue'
import menuSource from './menu.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import separatorsDemo from './separators.vue'
import separatorsSource from './separators.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const options = { className: 'breadcrumbs-preview' }

export const breadcrumbsSeparators = defineDemo(separatorsDemo, separatorsSource, options)
export const breadcrumbsDeep = defineDemo(deepDemo, deepSource, options)
export const breadcrumbsMenu = defineDemo(menuDemo, menuSource, options)
export const breadcrumbsMenuSelection = defineDemo(menuSelectionDemo, menuSelectionSource, options)
export const breadcrumbsVariants = defineDemo(variantsDemo, variantsSource, options)
export const breadcrumbsIcons = defineDemo(iconsDemo, iconsSource, options)
export const breadcrumbsOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
