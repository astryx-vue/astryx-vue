import { defineDemo } from '../../demo-infra/defineDemo'
import categoryDemo from './category.vue'
import categorySource from './category.vue?raw&highlighted'
import fruitDemo from './fruit.vue'
import fruitSource from './fruit.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import treeDemo from './tree.vue'
import treeSource from './tree.vue?raw&highlighted'

const options = { className: 'complex-selector-preview' }

export const complexSelectorFruit = defineDemo(fruitDemo, fruitSource, options)
export const complexSelectorTree = defineDemo(treeDemo, treeSource, options)
export const complexSelectorCategory = defineDemo(categoryDemo, categorySource, options)
export const complexSelectorStatus = defineDemo(statusDemo, statusSource, options)
export const complexSelectorOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
