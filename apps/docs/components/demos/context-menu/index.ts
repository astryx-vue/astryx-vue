import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import bottomSheetDemo from './bottom-sheet.vue'
import bottomSheetSource from './bottom-sheet.vue?raw&highlighted'
import compoundDemo from './compound.vue'
import compoundSource from './compound.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import selectionDemo from './selection.vue'
import selectionSource from './selection.vue?raw&highlighted'
import submenuDemo from './submenu.vue'
import submenuSource from './submenu.vue?raw&highlighted'

const options = { className: 'context-menu-preview' }

export const contextMenuOverview = defineDemo(overviewDemo, overviewSource, options)
export const contextMenuBasic = defineDemo(basicDemo, basicSource, options)
export const contextMenuBottomSheet = defineDemo(bottomSheetDemo, bottomSheetSource, options)
export const contextMenuCompound = defineDemo(compoundDemo, compoundSource, options)
export const contextMenuSelection = defineDemo(selectionDemo, selectionSource, options)
export const contextMenuSubmenu = defineDemo(submenuDemo, submenuSource, options)
