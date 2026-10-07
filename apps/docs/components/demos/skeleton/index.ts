import { defineDemo } from '../../demo-infra/defineDemo'
import profileDemo from './profile.vue'
import profileSource from './profile.vue?raw&highlighted'

export const skeletonProfile = defineDemo(profileDemo, profileSource, {
  className: 'skeleton-preview',
})
