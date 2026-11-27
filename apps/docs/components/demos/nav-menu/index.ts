import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import descriptionsDemo from './descriptions.vue'
import descriptionsSource from './descriptions.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import iconsDemo from './icons.vue'
import iconsSource from './icons.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const navMenuBasic = defineDemo(basicDemo, basicSource)
export const navMenuIcons = defineDemo(iconsDemo, iconsSource)
export const navMenuDescriptions = defineDemo(descriptionsDemo, descriptionsSource)
export const navMenuSizes = defineDemo(sizesDemo, sizesSource)
export const navMenuDisabled = defineDemo(disabledDemo, disabledSource)
export const navMenuOverview = defineDemo(overviewDemo, overviewSource)
