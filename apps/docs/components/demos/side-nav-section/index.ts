import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'side-nav-preview' }

export const sideNavSectionBasic = defineDemo(basicDemo, basicSource, options)
export const sideNavSectionOverview = defineDemo(overviewDemo, overviewSource, options)
