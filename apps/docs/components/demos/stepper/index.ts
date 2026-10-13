import { defineDemo } from '../../demo-infra/defineDemo'
import checkoutDemo from './checkout.vue'
import checkoutSource from './checkout.vue?raw&highlighted'
import customDemo from './custom.vue'
import customSource from './custom.vue?raw&highlighted'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import indicatorsDemo from './indicators.vue'
import indicatorsSource from './indicators.vue?raw&highlighted'
import narrowDemo from './narrow.vue'
import narrowSource from './narrow.vue?raw&highlighted'
import onTrackDemo from './on-track.vue'
import onTrackSource from './on-track.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

const options = { className: 'stepper-preview' }

export const stepperCheckout = defineDemo(checkoutDemo, checkoutSource, options)
export const stepperCustom = defineDemo(customDemo, customSource, options)
export const stepperNarrow = defineDemo(narrowDemo, narrowSource, options)
export const stepperIndicators = defineDemo(indicatorsDemo, indicatorsSource, options)
export const stepperHorizontal = defineDemo(horizontalDemo, horizontalSource, options)
export const stepperOnTrack = defineDemo(onTrackDemo, onTrackSource, options)
export const stepperStatus = defineDemo(statusDemo, statusSource, options)
export const stepperOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
