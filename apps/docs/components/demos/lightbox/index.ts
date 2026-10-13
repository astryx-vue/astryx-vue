import { defineDemo } from '../../demo-infra/defineDemo'
import galleryDemo from './gallery.vue'
import gallerySource from './gallery.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import videoDemo from './video.vue'
import videoSource from './video.vue?raw&highlighted'
import zoomDemo from './zoom.vue'
import zoomSource from './zoom.vue?raw&highlighted'

export const lightboxOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const lightboxGallery = defineDemo(galleryDemo, gallerySource)
export const lightboxVideo = defineDemo(videoDemo, videoSource)
export const lightboxZoom = defineDemo(zoomDemo, zoomSource)
