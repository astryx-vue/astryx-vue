import { defineDemo } from '../../demo-infra/defineDemo'
import lightboxDemo from './use-lightbox.vue'
import lightboxSource from './use-lightbox.vue?raw&highlighted'

export const useLightboxGallery = defineDemo(lightboxDemo, lightboxSource)
