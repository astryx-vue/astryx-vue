import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import badgesDemo from './badges.vue'
import badgesSource from './badges.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import cappedDemo from './capped.vue'
import cappedSource from './capped.vue?raw&highlighted'
import collapseStartDemo from './collapse-start.vue'
import collapseStartSource from './collapse-start.vue?raw&highlighted'
import multiRowDemo from './multi-row.vue'
import multiRowSource from './multi-row.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const overflowListBasic = defineDemo(basicDemo, basicSource)
export const overflowListCollapseStart = defineDemo(collapseStartDemo, collapseStartSource)
export const overflowListMultiRow = defineDemo(multiRowDemo, multiRowSource)
export const overflowListCapped = defineDemo(cappedDemo, cappedSource)
export const overflowListBadges = defineDemo(badgesDemo, badgesSource)
export const overflowListActions = defineDemo(actionsDemo, actionsSource)
export const overflowListOverview = defineDemo(overviewDemo, overviewSource)
