import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import selectionDemo from './selection.vue'
import selectionSource from './selection.vue?raw&highlighted'
import verticalDemo from './vertical.vue'
import verticalSource from './vertical.vue?raw&highlighted'

const options = { className: 'toggle-button-group-preview' }

export const toggleButtonGroupSelection = defineDemo(selectionDemo, selectionSource, options)
export const toggleButtonGroupVertical = defineDemo(verticalDemo, verticalSource, options)
export const toggleButtonGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
