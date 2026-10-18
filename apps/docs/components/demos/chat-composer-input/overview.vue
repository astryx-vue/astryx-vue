<script setup lang="ts">
import { ChatComposer, ChatComposerInput } from '@astryx-vue/core/Chat'
</script>

<template>
  <ChatComposer>
    <template #input>
      <ChatComposerInput placeholder="Ask me anything about Astryx..." />
    </template>
  </ChatComposer>
</template>
