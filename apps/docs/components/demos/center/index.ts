import { defineDemo } from '../../demo-infra/defineDemo'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import insideCardDemo from './inside-card.vue'
import insideCardSource from './inside-card.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'center-preview' }

export const centerHorizontal = defineDemo(horizontalDemo, horizontalSource, options)
export const centerInsideCard = defineDemo(insideCardDemo, insideCardSource, options)
export const centerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
