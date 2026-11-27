import { defineDemo } from '../../demo-infra/defineDemo'
import cardDemo from './card.vue'
import cardSource from './card.vue?raw&highlighted'
import nonModalDemo from './non-modal.vue'
import nonModalSource from './non-modal.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const drawerCard = defineDemo(cardDemo, cardSource, { className: 'overview-frame' })
export const drawerOverview = defineDemo(overviewDemo, overviewSource)
export const drawerNonModal = defineDemo(nonModalDemo, nonModalSource)
