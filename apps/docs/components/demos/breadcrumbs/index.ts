import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import supportingDemo from './supporting.vue'
import supportingSource from './supporting.vue?raw&highlighted'

export const breadcrumbsBasic = defineDemo(basicDemo, basicSource, {
  className: 'breadcrumbs-preview',
})

export const breadcrumbsSupporting = defineDemo(supportingDemo, supportingSource, {
  className: 'breadcrumbs-preview',
})
