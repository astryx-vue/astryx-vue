import { defineDemo } from '../../demo-infra/defineDemo'
import bulkDemo from './bulk.vue'
import bulkSource from './bulk.vue?raw&highlighted'
import cardDemo from './card.vue'
import cardSource from './card.vue?raw&highlighted'
import filterDemo from './filter.vue'
import filterSource from './filter.vue?raw&highlighted'
import overflowDemo from './overflow.vue'
import overflowSource from './overflow.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import tabsDemo from './tabs.vue'
import tabsSource from './tabs.vue?raw&highlighted'
import threeSlotDemo from './three-slot.vue'
import threeSlotSource from './three-slot.vue?raw&highlighted'

export const toolbarThreeSlot = defineDemo(threeSlotDemo, threeSlotSource)
export const toolbarSizes = defineDemo(sizesDemo, sizesSource)
export const toolbarTabs = defineDemo(tabsDemo, tabsSource)
export const toolbarCard = defineDemo(cardDemo, cardSource)
export const toolbarBulk = defineDemo(bulkDemo, bulkSource)
export const toolbarFilter = defineDemo(filterDemo, filterSource)
export const toolbarOverflow = defineDemo(overflowDemo, overflowSource)
export const toolbarOverview = defineDemo(overviewDemo, overviewSource)
