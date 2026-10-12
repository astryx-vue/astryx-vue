import { defineDemo } from '../../demo-infra/defineDemo'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import galleryDemo from './gallery.vue'
import gallerySource from './gallery.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import removableDemo from './removable.vue'
import removableSource from './removable.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'

export const thumbnailOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const thumbnailDisabled = defineDemo(disabledDemo, disabledSource)
export const thumbnailGallery = defineDemo(galleryDemo, gallerySource)
export const thumbnailRemovable = defineDemo(removableDemo, removableSource)
export const thumbnailStates = defineDemo(statesDemo, statesSource)
