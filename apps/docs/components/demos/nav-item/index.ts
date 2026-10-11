import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import iconOnlyDemo from './icon-only.vue'
import iconOnlySource from './icon-only.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import selectedDemo from './selected.vue'
import selectedSource from './selected.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const navItemBasic = defineDemo(basicDemo, basicSource)
export const navItemSelected = defineDemo(selectedDemo, selectedSource)
export const navItemDisabled = defineDemo(disabledDemo, disabledSource)
export const navItemSizes = defineDemo(sizesDemo, sizesSource)
export const navItemIconOnly = defineDemo(iconOnlyDemo, iconOnlySource)
export const navItemOverview = defineDemo(overviewDemo, overviewSource)
