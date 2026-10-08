import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import dividerDemo from './divider.vue'
import dividerSource from './divider.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const tabListBasic = defineDemo(basicDemo, basicSource, {
  className: 'tab-list-preview',
})

export const tabListSizes = defineDemo(sizesDemo, sizesSource, {
  className: 'tab-list-preview',
})

export const tabListDivider = defineDemo(dividerDemo, dividerSource, {
  className: 'tab-list-preview',
})
