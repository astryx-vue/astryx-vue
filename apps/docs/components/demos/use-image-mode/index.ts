import { defineDemo } from '../../demo-infra/defineDemo'
import photoCaptionDemo from './photo-caption.vue'
import photoCaptionSource from './photo-caption.vue?raw&highlighted'

export const useImageModePhotoCaption = defineDemo(photoCaptionDemo, photoCaptionSource)
