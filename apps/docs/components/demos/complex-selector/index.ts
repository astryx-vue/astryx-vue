import { defineDemo } from '../../demo-infra/defineDemo'
import deadlineDemo from './deadline.vue'
import deadlineSource from './deadline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import treeDemo from './tree.vue'
import treeSource from './tree.vue?raw&highlighted'

const options = { className: 'complex-selector-preview' }

export const complexSelectorDeadline = defineDemo(deadlineDemo, deadlineSource, options)
export const complexSelectorTree = defineDemo(treeDemo, treeSource, options)
export const complexSelectorOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
