import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import containersDemo from './containers.vue'
import containersSource from './containers.vue?raw&highlighted'
import detailsDemo from './details.vue'
import detailsSource from './details.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusesDemo from './statuses.vue'
import statusesSource from './statuses.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const bannerStatuses = defineDemo(statusesDemo, statusesSource, options)
export const bannerDetails = defineDemo(detailsDemo, detailsSource, options)
export const bannerActions = defineDemo(actionsDemo, actionsSource, options)
export const bannerContainers = defineDemo(containersDemo, containersSource, options)

export const bannerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
