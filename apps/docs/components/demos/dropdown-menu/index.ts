import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import adaptiveDemo from './adaptive.vue'
import adaptiveSource from './adaptive.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import iconTriggerDemo from './icon-trigger.vue'
import iconTriggerSource from './icon-trigger.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sectionsDemo from './sections.vue'
import sectionsSource from './sections.vue?raw&highlighted'
import submenuDemo from './submenu.vue'
import submenuSource from './submenu.vue?raw&highlighted'

const options = { className: 'dropdown-menu-preview-host' }

export const dropdownMenuActions = defineDemo(actionsDemo, actionsSource, options)
export const dropdownMenuAdaptive = defineDemo(adaptiveDemo, adaptiveSource, options)
export const dropdownMenuIconTrigger = defineDemo(iconTriggerDemo, iconTriggerSource, options)
export const dropdownMenuDisabled = defineDemo(disabledDemo, disabledSource, options)
export const dropdownMenuSections = defineDemo(sectionsDemo, sectionsSource, options)
export const dropdownMenuSubmenu = defineDemo(submenuDemo, submenuSource, options)

export const dropdownMenuOverview = defineDemo(overviewDemo, overviewSource, options)
