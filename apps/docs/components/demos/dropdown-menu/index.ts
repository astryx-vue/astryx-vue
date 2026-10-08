import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sectionsDemo from './sections.vue'
import sectionsSource from './sections.vue?raw&highlighted'
import shortcutsDemo from './shortcuts.vue'
import shortcutsSource from './shortcuts.vue?raw&highlighted'

const options = { className: 'dropdown-menu-preview-host' }

export const dropdownMenuOverview = defineDemo(overviewDemo, overviewSource, options)
export const dropdownMenuBasic = defineDemo(basicDemo, basicSource, options)
export const dropdownMenuSections = defineDemo(sectionsDemo, sectionsSource, options)
export const dropdownMenuShortcuts = defineDemo(shortcutsDemo, shortcutsSource, options)
