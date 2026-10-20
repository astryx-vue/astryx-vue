import { defineDemo } from '../../demo-infra/defineDemo'
import customContainerDemo from './custom-container.vue'
import customContainerSource from './custom-container.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'scrollbars-provider-preview' }

export const scrollbarsProviderCustomContainer = defineDemo(customContainerDemo, customContainerSource, options)
export const scrollbarsProviderOverview = defineDemo(overviewDemo, overviewSource, options)
