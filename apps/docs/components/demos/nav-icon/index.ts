import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from '../nav-item/basic.vue'
import basicSource from '../nav-item/basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const navIconBasic = defineDemo(basicDemo, basicSource)
export const navIconOverview = defineDemo(overviewDemo, overviewSource)
