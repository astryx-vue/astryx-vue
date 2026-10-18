import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const commandPaletteEmptyBasic = defineDemo(basicDemo, basicSource)
export const commandPaletteEmptyOverview = defineDemo(overviewDemo, overviewSource)
