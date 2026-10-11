import { defineDemo } from '../../demo-infra/defineDemo'
import conversationDemo from './conversation.vue'
import conversationSource from './conversation.vue?raw&highlighted'

export const chatConversation = defineDemo(conversationDemo, conversationSource, {
  className: 'chat-preview',
})
