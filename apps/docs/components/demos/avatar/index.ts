import { defineDemo } from '../../demo-infra/defineDemo'
import fallbackDemo from './fallback.vue'
import fallbackSource from './fallback.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import shapesDemo from './shapes.vue'
import shapesSource from './shapes.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

export const avatarSizes = defineDemo(sizesDemo, sizesSource, {
  className: 'avatar-preview',
})

export const avatarShapes = defineDemo(shapesDemo, shapesSource, {
  className: 'avatar-preview',
})

export const avatarFallback = defineDemo(fallbackDemo, fallbackSource, {
  className: 'avatar-preview',
})

export const avatarStatus = defineDemo(statusDemo, statusSource, {
  className: 'avatar-preview',
})

export const avatarOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
