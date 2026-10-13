import { defineDemo } from '../../demo-infra/defineDemo'
import imageOverlayDemo from './image-overlay.vue'
import imageOverlaySource from './image-overlay.vue?raw&highlighted'
import lightScrimDemo from './light-scrim.vue'
import lightScrimSource from './light-scrim.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'media-theme-preview' }

export const mediaThemeOverview = defineDemo(overviewDemo, overviewSource, options)
export const mediaThemeImageOverlay = defineDemo(imageOverlayDemo, imageOverlaySource, options)
export const mediaThemeLightScrim = defineDemo(lightScrimDemo, lightScrimSource, options)
