import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import richDemo from './rich.vue'
import richSource from './rich.vue?raw&highlighted'
import streamingDemo from './streaming.vue'
import streamingSource from './streaming.vue?raw&highlighted'

const options = { className: 'markdown-preview' }

export const markdownBasic = defineDemo(basicDemo, basicSource, options)
export const markdownRich = defineDemo(richDemo, richSource, options)
export const markdownStreaming = defineDemo(streamingDemo, streamingSource, options)
