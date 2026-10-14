<script setup lang="ts">
import type { ChatComposerTokenElementProps } from './types.js'
import ChatTokenContent from './ChatTokenContent.vue'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatComposerTokenElement', inheritAttrs: false })

defineProps<ChatComposerTokenElementProps>()
</script>

<template>
  <span
    v-bind="$attrs"
    class="astryx-chat-token"
    data-astryx-token=""
    :data-astryx-token-value="token.value"
    contenteditable="false"
  >
    <ChatTokenContent :token="token" />
  </span>
</template>
