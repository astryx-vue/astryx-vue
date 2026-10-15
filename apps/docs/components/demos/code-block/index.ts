import { defineDemo } from '../../demo-infra/defineDemo'
import configDemo from './config.vue'
import configSource from './config.vue?raw&highlighted'
import diffDemo from './diff.vue'
import diffSource from './diff.vue?raw&highlighted'
import highlightedDemo from './highlighted.vue'
import highlightedSource from './highlighted.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import scrollableDemo from './scrollable.vue'
import scrollableSource from './scrollable.vue?raw&highlighted'
import snippetDemo from './snippet.vue'
import snippetSource from './snippet.vue?raw&highlighted'
import terminalDemo from './terminal.vue'
import terminalSource from './terminal.vue?raw&highlighted'

export const codeBlockOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
export const codeBlockSnippet = defineDemo(snippetDemo, snippetSource)
export const codeBlockHighlighted = defineDemo(highlightedDemo, highlightedSource)
export const codeBlockConfig = defineDemo(configDemo, configSource)
export const codeBlockDiff = defineDemo(diffDemo, diffSource)
export const codeBlockScrollable = defineDemo(scrollableDemo, scrollableSource)
export const codeBlockTerminal = defineDemo(terminalDemo, terminalSource)
