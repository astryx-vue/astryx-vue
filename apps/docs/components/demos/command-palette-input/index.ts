import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './overview.vue'
import overviewDemo from './overview.vue'
import basicSource from './overview.vue?raw&highlighted'
import overviewSource from './overview.vue?raw&highlighted'

export const commandPaletteInputBasic = defineDemo(basicDemo, basicSource)
export const commandPaletteInputOverview = defineDemo(overviewDemo, overviewSource)
