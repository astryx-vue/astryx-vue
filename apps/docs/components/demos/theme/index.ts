import { defineDemo } from '../../demo-infra/defineDemo'
import applyDemo from './apply.vue'
import applySource from './apply.vue?raw&highlighted'
import nestedDemo from './nested.vue'
import nestedSource from './nested.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import switcherDemo from './switcher.vue'
import switcherSource from './switcher.vue?raw&highlighted'

export const themeOverview = defineDemo(overviewDemo, overviewSource, { className: 'theme-preview' })
export const themeApply = defineDemo(applyDemo, applySource, { className: 'theme-preview' })
export const themeNested = defineDemo(nestedDemo, nestedSource, { className: 'theme-preview' })
export const themeSwitcher = defineDemo(switcherDemo, switcherSource, { className: 'theme-preview' })
