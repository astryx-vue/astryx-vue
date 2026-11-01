import { defineDemo } from '../../demo-infra/defineDemo'
import autoLinkDemo from './autolink.vue'
import autoLinkSource from './autolink.vue?raw&highlighted'
import viewDemo from './view.vue'
import viewSource from './view.vue?raw&highlighted'
import toolbarDemo from './with-toolbar.vue'
import toolbarSource from './with-toolbar.vue?raw&highlighted'

const className = 'richtext-demo'

export const richtextToolbar = defineDemo(toolbarDemo, toolbarSource, { className })
export const richtextAutoLink = defineDemo(autoLinkDemo, autoLinkSource, { className })
export const richtextView = defineDemo(viewDemo, viewSource, { className })
