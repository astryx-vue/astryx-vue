import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import groupDemo from './group.vue'
import groupSource from './group.vue?raw&highlighted'
import iconOnlyDemo from './icon-only.vue'
import iconOnlySource from './icon-only.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

const options = { className: 'toggle-button-preview' }

export const toggleButtonBasic = defineDemo(basicDemo, basicSource, options)
export const toggleButtonGroup = defineDemo(groupDemo, groupSource, options)
export const toggleButtonIconOnly = defineDemo(iconOnlyDemo, iconOnlySource, options)
export const toggleButtonStates = defineDemo(statesDemo, statesSource, options)

export const toggleButtonOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
