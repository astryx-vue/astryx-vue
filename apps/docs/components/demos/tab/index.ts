import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import selectedIconDemo from './selected-icon.vue'
import selectedIconSource from './selected-icon.vue?raw&highlighted'

const options = { className: 'overview-hug' }

export const tabOverview = defineDemo(overviewDemo, overviewSource, options)
export const tabSelectedIcon = defineDemo(selectedIconDemo, selectedIconSource, options)
