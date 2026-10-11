import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import withIconDemo from './with-icon.vue'
import withIconSource from './with-icon.vue?raw&highlighted'

export const inputGroupBasic = defineDemo(basicDemo, basicSource)
export const inputGroupWithIcon = defineDemo(withIconDemo, withIconSource)

export const inputGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
