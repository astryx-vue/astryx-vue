import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import snapDemo from './snap.vue'
import snapSource from './snap.vue?raw&highlighted'
import tallDemo from './tall.vue'
import tallSource from './tall.vue?raw&highlighted'

const options = { className: 'bottom-sheet-preview' }

export const bottomSheetOverview = defineDemo(overviewDemo, overviewSource, options)
export const bottomSheetBasic = defineDemo(basicDemo, basicSource, options)
export const bottomSheetTall = defineDemo(tallDemo, tallSource, options)
export const bottomSheetSnap = defineDemo(snapDemo, snapSource, options)
