import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import sizeChangerDemo from './size-changer.vue'
import sizeChangerSource from './size-changer.vue?raw&highlighted'

export const paginationBasic = defineDemo(basicDemo, basicSource, { className: 'pagination-preview' })
export const paginationSizeChanger = defineDemo(sizeChangerDemo, sizeChangerSource, { className: 'pagination-preview' })
