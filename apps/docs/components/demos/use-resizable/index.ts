import { defineDemo } from '../../demo-infra/defineDemo'
import splitDemo from '../resize-handle/horizontal.vue'
import splitSource from '../resize-handle/horizontal.vue?raw&highlighted'
import collapsibleDemo from '../resize-handle/sidebar.vue'
import collapsibleSource from '../resize-handle/sidebar.vue?raw&highlighted'

const options = { className: 'resize-preview' }

export const useResizableSplit = defineDemo(splitDemo, splitSource, options)
export const useResizableCollapsible = defineDemo(collapsibleDemo, collapsibleSource, options)
