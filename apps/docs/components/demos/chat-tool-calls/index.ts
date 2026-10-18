import { defineDemo } from '../../demo-infra/defineDemo'
import expandableDemo from './expandable.vue'
import expandableSource from './expandable.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import simpleDemo from './simple.vue'
import simpleSource from './simple.vue?raw&highlighted'
import statusesDemo from './statuses.vue'
import statusesSource from './statuses.vue?raw&highlighted'

const column = { className: 'chat-preview' }

export const chatToolCallsOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatToolCallsExpandable = defineDemo(expandableDemo, expandableSource, column)
export const chatToolCallsSimple = defineDemo(simpleDemo, simpleSource, column)
export const chatToolCallsStatuses = defineDemo(statusesDemo, statusesSource, column)
