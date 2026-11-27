import { defineDemo } from '../../demo-infra/defineDemo'
import longPasteDemo from './long-paste.vue'
import longPasteSource from './long-paste.vue?raw&highlighted'

export const useChatPasteAsTokenLongPaste = defineDemo(longPasteDemo, longPasteSource)
