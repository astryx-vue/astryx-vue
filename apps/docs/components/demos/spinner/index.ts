import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import labelDemo from './label.vue'
import labelSource from './label.vue?raw&highlighted'
import shadesDemo from './shades.vue'
import shadesSource from './shades.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const spinnerBasic = defineDemo(basicDemo, basicSource, options)
export const spinnerSizes = defineDemo(sizesDemo, sizesSource, options)
export const spinnerShades = defineDemo(shadesDemo, shadesSource, options)
export const spinnerLabel = defineDemo(labelDemo, labelSource, options)
