import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import badgesDemo from './badges.vue'
import badgesSource from './badges.vue?raw&highlighted'
import fillDemo from './fill.vue'
import fillSource from './fill.vue?raw&highlighted'
import iconsDemo from './icons.vue'
import iconsSource from './icons.vue?raw&highlighted'
import overflowDemo from './overflow.vue'
import overflowSource from './overflow.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import scrollDemo from './scroll.vue'
import scrollSource from './scroll.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

const options = { className: 'tab-list-preview' }

export const tabListFill = defineDemo(fillDemo, fillSource, options)
export const tabListActions = defineDemo(actionsDemo, actionsSource, options)
export const tabListBadges = defineDemo(badgesDemo, badgesSource, options)
export const tabListIcons = defineDemo(iconsDemo, iconsSource, options)
export const tabListOverflow = defineDemo(overflowDemo, overflowSource, options)
export const tabListScroll = defineDemo(scrollDemo, scrollSource, options)
export const tabListStatus = defineDemo(statusDemo, statusSource, options)
export const tabListOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
