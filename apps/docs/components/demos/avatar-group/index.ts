import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import groupDemo from './group.vue'
import groupSource from './group.vue?raw&highlighted'
import interactiveDemo from './interactive.vue'
import interactiveSource from './interactive.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const avatarGroupBasic = defineDemo(basicDemo, basicSource, {
  className: 'avatar-group-preview',
})

export const avatarGroupSizes = defineDemo(sizesDemo, sizesSource, {
  className: 'avatar-group-preview',
})

export const avatarGroupGroup = defineDemo(groupDemo, groupSource, {
  className: 'avatar-group-preview',
})

export const avatarGroupInteractive = defineDemo(interactiveDemo, interactiveSource, {
  className: 'avatar-group-preview',
})

export const avatarGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
