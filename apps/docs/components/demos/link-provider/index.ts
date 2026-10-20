import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'link-provider-preview' }

export const linkProviderOverview = defineDemo(overviewDemo, overviewSource, options)
