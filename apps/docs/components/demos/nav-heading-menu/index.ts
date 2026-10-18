import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'nav-heading-menu-preview' }

export const navHeadingMenuOverview = defineDemo(overviewDemo, overviewSource, options)
