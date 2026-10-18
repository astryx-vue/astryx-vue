import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'dropdown-menu-preview-host' }

export const dropdownMenuSubMenuOverview = defineDemo(overviewDemo, overviewSource, options)
