import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import colorDemo from './color.vue'
import colorSource from './color.vue?raw&highlighted'
import groupDemo from './group.vue'
import groupSource from './group.vue?raw&highlighted'
import iconOnlyDemo from './icon-only.vue'
import iconOnlySource from './icon-only.vue?raw&highlighted'
import iconSwapDemo from './icon-swap.vue'
import iconSwapSource from './icon-swap.vue?raw&highlighted'
import labelDemo from './label.vue'
import labelSource from './label.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'toggle-button-preview' }

export const toggleButtonBasic = defineDemo(basicDemo, basicSource, options)
export const toggleButtonGroup = defineDemo(groupDemo, groupSource, options)
export const toggleButtonIconOnly = defineDemo(iconOnlyDemo, iconOnlySource, options)
export const toggleButtonColor = defineDemo(colorDemo, colorSource, options)
export const toggleButtonIconSwap = defineDemo(iconSwapDemo, iconSwapSource, options)
export const toggleButtonLabel = defineDemo(labelDemo, labelSource, options)
export const toggleButtonStates = defineDemo(statesDemo, statesSource, options)

export const toggleButtonOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
