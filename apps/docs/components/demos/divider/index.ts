import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import labelDemo from './label.vue'
import labelSource from './label.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'
import verticalDemo from './vertical.vue'
import verticalSource from './vertical.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const dividerBasic = defineDemo(basicDemo, basicSource, options)
export const dividerLabel = defineDemo(labelDemo, labelSource, options)
export const dividerVariants = defineDemo(variantsDemo, variantsSource, options)
export const dividerVertical = defineDemo(verticalDemo, verticalSource, options)
