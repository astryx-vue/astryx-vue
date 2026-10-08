import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import collapsibleDemo from './collapsible.vue'
import collapsibleSource from './collapsible.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import lineNumbersDemo from './line-numbers.vue'
import lineNumbersSource from './line-numbers.vue?raw&highlighted'

const options = { className: 'code-preview' }

export const codeBasic = defineDemo(basicDemo, basicSource, options)
export const codeInline = defineDemo(inlineDemo, inlineSource, options)
export const codeLineNumbers = defineDemo(lineNumbersDemo, lineNumbersSource, options)
export const codeCollapsible = defineDemo(collapsibleDemo, collapsibleSource, options)
