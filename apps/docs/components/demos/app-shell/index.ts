import { defineDemo } from '../../demo-infra/defineDemo'
import bannerDemo from './banner.vue'
import bannerSource from './banner.vue?raw&highlighted'
import contentOnlyDemo from './content-only.vue'
import contentOnlySource from './content-only.vue?raw&highlighted'
import mobileHookDemo from './mobile-hook.vue'
import mobileHookSource from './mobile-hook.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sideNavDemo from './side-nav.vue'
import sideNavSource from './side-nav.vue?raw&highlighted'
import topAndSideDemo from './top-and-side.vue'
import topAndSideSource from './top-and-side.vue?raw&highlighted'
import topNavDemo from './top-nav.vue'
import topNavSource from './top-nav.vue?raw&highlighted'

const options = { className: 'app-shell-preview' }

export const appShellContentOnly = defineDemo(contentOnlyDemo, contentOnlySource, options)
export const appShellMobileHook = defineDemo(mobileHookDemo, mobileHookSource, { className: 'app-shell-preview' })
export const appShellSideNav = defineDemo(sideNavDemo, sideNavSource, options)
export const appShellTopNav = defineDemo(topNavDemo, topNavSource, options)
export const appShellTopAndSide = defineDemo(topAndSideDemo, topAndSideSource, options)
export const appShellBanner = defineDemo(bannerDemo, bannerSource, options)
export const appShellOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
