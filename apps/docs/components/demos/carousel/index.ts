import { defineDemo } from '../../demo-infra/defineDemo'
import cardsDemo from './cards.vue'
import cardsSource from './cards.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import snapDemo from './snap.vue'
import snapSource from './snap.vue?raw&highlighted'

export const carouselOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
export const carouselCards = defineDemo(cardsDemo, cardsSource)
export const carouselSnap = defineDemo(snapDemo, snapSource)
