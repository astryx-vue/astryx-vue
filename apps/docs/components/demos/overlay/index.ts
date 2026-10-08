import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import hoverDemo from './hover.vue'
import hoverSource from './hover.vue?raw&highlighted'
import positionsDemo from './positions.vue'
import positionsSource from './positions.vue?raw&highlighted'
import scrimDemo from './scrim.vue'
import scrimSource from './scrim.vue?raw&highlighted'

const options = { className: 'overlay-preview' }

export const overlayBasic = defineDemo(basicDemo, basicSource, options)
export const overlayScrim = defineDemo(scrimDemo, scrimSource, options)
export const overlayPositions = defineDemo(positionsDemo, positionsSource, options)
export const overlayHover = defineDemo(hoverDemo, hoverSource, options)
