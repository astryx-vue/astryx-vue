<script setup lang="ts">
import { ChatLayoutScrollButton } from '@astryx-vue/core/Chat'
</script>

<template>
  <div class="chat-preview-stack chat-preview-stack--center">
    <p class="chat-preview__caption">
      {{ 'Labels expand the button to give context' }}
    </p>
    <div class="chat-preview-row chat-preview-row--center">
      <ChatLayoutScrollButton is-visible />
      <ChatLayoutScrollButton is-visible label="New messages" />
      <ChatLayoutScrollButton is-visible label="3 unread replies" />
    </div>
  </div>
</template>
