import { defineDemo } from '../../demo-infra/defineDemo'
import overridesDemo from './overrides.vue'
import overridesSource from './overrides.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'internationalization-provider-preview' }

export const internationalizationProviderOverview = defineDemo(overviewDemo, overviewSource, options)
export const internationalizationProviderOverrides = defineDemo(overridesDemo, overridesSource, options)
