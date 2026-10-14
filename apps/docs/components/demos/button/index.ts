import { defineDemo } from '../../demo-infra/defineDemo'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import endSlotDemo from './end-slot.vue'
import endSlotSource from './end-slot.vue?raw&highlighted'
import floatingDemo from './floating.vue'
import floatingSource from './floating.vue?raw&highlighted'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const buttonPreviewClass = 'button-preview-host button-preview'

export const buttonVariants = defineDemo(variantsDemo, variantsSource, {
  className: buttonPreviewClass,
})

export const buttonFloating = defineDemo(floatingDemo, floatingSource, {
  className: `${buttonPreviewClass} button-preview--floating`,
})

export const buttonSizes = defineDemo(sizesDemo, sizesSource, {
  className: `${buttonPreviewClass} button-preview--sizes`,
})

export const buttonAsync = defineDemo(asyncDemo, asyncSource, {
  className: `${buttonPreviewClass} button-preview--async`,
})

export const buttonEndSlot = defineDemo(endSlotDemo, endSlotSource, {
  className: buttonPreviewClass,
})

export const buttonIcon = defineDemo(iconDemo, iconSource, {
  className: buttonPreviewClass,
})

export const buttonOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
