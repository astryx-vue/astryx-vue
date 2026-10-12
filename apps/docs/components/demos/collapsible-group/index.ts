import { defineDemo } from '../../demo-infra/defineDemo'
import densityDemo from './density.vue'
import densitySource from './density.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'collapsible-group-preview' }

export const collapsibleGroupDensity = defineDemo(densityDemo, densitySource, options)
export const collapsibleGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
