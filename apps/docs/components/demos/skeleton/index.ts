import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import profileDemo from './profile.vue'
import profileSource from './profile.vue?raw&highlighted'

export const skeletonProfile = defineDemo(profileDemo, profileSource, {
  className: 'skeleton-preview',
})

export const skeletonOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
