import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sideNavDemo from './side-nav.vue'
import sideNavSource from './side-nav.vue?raw&highlighted'
import topNavDemo from './top-nav.vue'
import topNavSource from './top-nav.vue?raw&highlighted'

const options = { className: 'nav-heading-menu-preview' }

export const navHeadingMenuOverview = defineDemo(overviewDemo, overviewSource, options)
export const navHeadingMenuSideNav = defineDemo(sideNavDemo, sideNavSource, options)
export const navHeadingMenuTopNav = defineDemo(topNavDemo, topNavSource, options)
