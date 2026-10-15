import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import collapseDemo from './collapse.vue'
import collapseSource from './collapse.vue?raw&highlighted'
import endDemo from './end.vue'
import endSource from './end.vue?raw&highlighted'
import headerMenuDemo from './header-menu.vue'
import headerMenuSource from './header-menu.vue?raw&highlighted'
import nestedDemo from './nested.vue'
import nestedSource from './nested.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import resizableDemo from './resizable.vue'
import resizableSource from './resizable.vue?raw&highlighted'

export const sideNavBasic = defineDemo(basicDemo, basicSource)
export const sideNavNested = defineDemo(nestedDemo, nestedSource)
export const sideNavEnd = defineDemo(endDemo, endSource)
export const sideNavHeaderMenu = defineDemo(headerMenuDemo, headerMenuSource)
export const sideNavCollapse = defineDemo(collapseDemo, collapseSource)
export const sideNavResizable = defineDemo(resizableDemo, resizableSource)
export const sideNavOverview = defineDemo(overviewDemo, overviewSource)
