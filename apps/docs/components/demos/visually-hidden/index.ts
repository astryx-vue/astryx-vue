import { defineDemo } from '../../demo-infra/defineDemo'
import contextDemo from './context.vue'
import contextSource from './context.vue?raw&highlighted'
import liveRegionDemo from './live-region.vue'
import liveRegionSource from './live-region.vue?raw&highlighted'

export const visuallyHiddenContext = defineDemo(contextDemo, contextSource, {
  className: 'visually-hidden-preview visually-hidden-preview--context',
})
export const visuallyHiddenLiveRegion = defineDemo(liveRegionDemo, liveRegionSource, {
  className: 'visually-hidden-preview visually-hidden-preview--live',
})
