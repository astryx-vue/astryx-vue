import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import centeredDemo from './centered.vue'
import centeredSource from './centered.vue?raw&highlighted'
import enterpriseDemo from './enterprise.vue'
import enterpriseSource from './enterprise.vue?raw&highlighted'
import logoDemo from './logo.vue'
import logoSource from './logo.vue?raw&highlighted'
import megaDemo from './mega.vue'
import megaSource from './mega.vue?raw&highlighted'
import menuDemo from './menu.vue'
import menuSource from './menu.vue?raw&highlighted'
import menusDemo from './menus.vue'
import menusSource from './menus.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const topNavBasic = defineDemo(basicDemo, basicSource)
export const topNavLogo = defineDemo(logoDemo, logoSource)
export const topNavCentered = defineDemo(centeredDemo, centeredSource)
export const topNavMenu = defineDemo(menuDemo, menuSource)
export const topNavMenus = defineDemo(menusDemo, menusSource)
export const topNavMega = defineDemo(megaDemo, megaSource)
export const topNavEnterprise = defineDemo(enterpriseDemo, enterpriseSource)
export const topNavOverview = defineDemo(overviewDemo, overviewSource)
