import { defineDemo } from '../../demo-infra/defineDemo'
import cardDemo from './card.vue'
import cardSource from './card.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const drawerCard = defineDemo(cardDemo, cardSource, { className: 'overview-frame' })
export const drawerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
