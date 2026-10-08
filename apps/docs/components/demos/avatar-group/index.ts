import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const avatarGroupBasic = defineDemo(basicDemo, basicSource, {
  className: 'avatar-group-preview',
})

export const avatarGroupSizes = defineDemo(sizesDemo, sizesSource, {
  className: 'avatar-group-preview',
})
