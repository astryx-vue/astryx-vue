import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const dropdownMenuCheckboxItemOverview = defineDemo(overviewDemo, overviewSource, {
  className: 'dropdown-menu-preview-host',
})
