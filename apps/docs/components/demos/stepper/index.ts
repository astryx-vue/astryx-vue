import { defineDemo } from '../../demo-infra/defineDemo'
import checkoutDemo from './checkout.vue'
import checkoutSource from './checkout.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import indicatorsDemo from './indicators.vue'
import indicatorsSource from './indicators.vue?raw&highlighted'
import onTrackDemo from './on-track.vue'
import onTrackSource from './on-track.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import verticalDemo from './vertical.vue'
import verticalSource from './vertical.vue?raw&highlighted'

const options = { className: 'stepper-preview' }

export const stepperCheckout = defineDemo(checkoutDemo, checkoutSource, options)
export const stepperVertical = defineDemo(verticalDemo, verticalSource, options)
export const stepperHorizontal = defineDemo(horizontalDemo, horizontalSource, options)
export const stepperIndicators = defineDemo(indicatorsDemo, indicatorsSource, options)
export const stepperForm = defineDemo(formDemo, formSource, options)
export const stepperOnTrack = defineDemo(onTrackDemo, onTrackSource, options)
export const stepperStatus = defineDemo(statusDemo, statusSource, options)
export const stepperOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
