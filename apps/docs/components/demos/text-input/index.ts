import { defineDemo } from '../../demo-infra/defineDemo'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import searchDemo from './search.vue'
import searchSource from './search.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import typesDemo from './types.vue'
import typesSource from './types.vue?raw&highlighted'
import variantDemo from './variant.vue'
import variantSource from './variant.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const textInputIcon = defineDemo(iconDemo, iconSource, options)
export const textInputSearch = defineDemo(searchDemo, searchSource, options)
export const textInputSizes = defineDemo(sizesDemo, sizesSource, options)
export const textInputStates = defineDemo(statesDemo, statesSource, options)
export const textInputVariant = defineDemo(variantDemo, variantSource, options)
export const textInputTypes = defineDemo(typesDemo, typesSource, options)

export const textInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
