import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import previewDemo from './preview.vue'
import previewSource from './preview.vue?raw&highlighted'
import stackDemo from './stack.vue'
import stackSource from './stack.vue?raw&highlighted'

export const toastBasic = defineDemo(basicDemo, basicSource, {
  className: 'toast-preview',
})

export const toastPreview = defineDemo(previewDemo, previewSource, {
  className: 'toast-preview',
})

export const toastStack = defineDemo(stackDemo, stackSource, {
  className: 'toast-preview',
})
