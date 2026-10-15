import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import bulletedDemo from './bulleted.vue'
import bulletedSource from './bulleted.vue?raw&highlighted'
import densitiesDemo from './densities.vue'
import densitiesSource from './densities.vue?raw&highlighted'
import interactiveDemo from './interactive.vue'
import interactiveSource from './interactive.vue?raw&highlighted'
import markersDemo from './markers.vue'
import markersSource from './markers.vue?raw&highlighted'
import messagesDemo from './messages.vue'
import messagesSource from './messages.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import stepsDemo from './steps.vue'
import stepsSource from './steps.vue?raw&highlighted'
import swipeDemo from './swipe.vue'
import swipeSource from './swipe.vue?raw&highlighted'

const options = { className: 'list-preview' }

export const listBasic = defineDemo(basicDemo, basicSource, options)
export const listBulleted = defineDemo(bulletedDemo, bulletedSource, options)
export const listMessages = defineDemo(messagesDemo, messagesSource, options)
export const listSteps = defineDemo(stepsDemo, stepsSource, options)
export const listDensities = defineDemo(densitiesDemo, densitiesSource, options)
export const listMarkers = defineDemo(markersDemo, markersSource, options)
export const listInteractive = defineDemo(interactiveDemo, interactiveSource, options)
export const listSwipe = defineDemo(swipeDemo, swipeSource, options)

export const listOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
