import { defineDemo } from '../../demo-infra/defineDemo'
import fallbackChainDemo from './fallback-chain.vue'
import fallbackChainSource from './fallback-chain.vue?raw&highlighted'
import fallbackDemo from './fallback.vue'
import fallbackSource from './fallback.vue?raw&highlighted'
import initialsDemo from './initials.vue'
import initialsSource from './initials.vue?raw&highlighted'
import interactiveDemo from './interactive.vue'
import interactiveSource from './interactive.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import photoDemo from './photo.vue'
import photoSource from './photo.vue?raw&highlighted'
import shapesDemo from './shapes.vue'
import shapesSource from './shapes.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import tooltipDemo from './tooltip.vue'
import tooltipSource from './tooltip.vue?raw&highlighted'
import userCardDemo from './user-card.vue'
import userCardSource from './user-card.vue?raw&highlighted'

export const avatarSizes = defineDemo(sizesDemo, sizesSource, {
  className: 'avatar-preview',
})

export const avatarShapes = defineDemo(shapesDemo, shapesSource, {
  className: 'avatar-preview',
})

export const avatarFallback = defineDemo(fallbackDemo, fallbackSource, {
  className: 'avatar-preview',
})

export const avatarFallbackChain = defineDemo(fallbackChainDemo, fallbackChainSource, {
  className: 'avatar-preview',
})

export const avatarInitials = defineDemo(initialsDemo, initialsSource, {
  className: 'avatar-preview',
})

export const avatarInteractive = defineDemo(interactiveDemo, interactiveSource, {
  className: 'avatar-preview',
})

export const avatarPhoto = defineDemo(photoDemo, photoSource, {
  className: 'avatar-preview',
})

export const avatarStatus = defineDemo(statusDemo, statusSource, {
  className: 'avatar-preview',
})

export const avatarTooltip = defineDemo(tooltipDemo, tooltipSource, {
  className: 'avatar-preview',
})

export const avatarUserCard = defineDemo(userCardDemo, userCardSource, {
  className: 'avatar-preview',
})

export const avatarOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
