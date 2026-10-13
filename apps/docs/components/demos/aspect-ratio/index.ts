import { defineDemo } from '../../demo-infra/defineDemo'
import circleDemo from './circle.vue'
import circleSource from './circle.vue?raw&highlighted'
import galleryDemo from './gallery.vue'
import gallerySource from './gallery.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import skeletonDemo from './skeleton.vue'
import skeletonSource from './skeleton.vue?raw&highlighted'
import squareDemo from './square.vue'
import squareSource from './square.vue?raw&highlighted'
import widescreenDemo from './widescreen.vue'
import widescreenSource from './widescreen.vue?raw&highlighted'

const options = { className: 'aspect-ratio-preview' }

export const aspectRatioCircle = defineDemo(circleDemo, circleSource, options)
export const aspectRatioSquare = defineDemo(squareDemo, squareSource, options)
export const aspectRatioWidescreen = defineDemo(widescreenDemo, widescreenSource, options)
export const aspectRatioGallery = defineDemo(galleryDemo, gallerySource, options)
export const aspectRatioSkeleton = defineDemo(skeletonDemo, skeletonSource, options)
export const aspectRatioOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
