import { defineDemo } from '../demo-infra/defineDemo'
import autoLinkDemo from './autolink.vue'
import autoLinkSource from './autolink.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import stateDemo from './dirty-state.vue'
import stateSource from './dirty-state.vue?raw&highlighted'
import readOnlyDemo from './read-only-field.vue'
import readOnlySource from './read-only-field.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import viewDemo from './view.vue'
import viewSource from './view.vue?raw&highlighted'
import toolbarDemo from './with-toolbar.vue'
import toolbarSource from './with-toolbar.vue?raw&highlighted'

const className = 'richtext-demo'

export const richtextBasic = defineDemo(basicDemo, basicSource, { className })
export const richtextToolbar = defineDemo(toolbarDemo, toolbarSource, { className })
export const richtextAutoLink = defineDemo(autoLinkDemo, autoLinkSource, { className })
export const richtextReadOnly = defineDemo(readOnlyDemo, readOnlySource, { className })
export const richtextView = defineDemo(viewDemo, viewSource, { className })
export const richtextStatus = defineDemo(statusDemo, statusSource, { className })
export const richtextState = defineDemo(stateDemo, stateSource, { className })
