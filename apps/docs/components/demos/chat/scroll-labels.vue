<script setup lang="ts">
import { ChatLayoutScrollButton } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <div class="chat-preview-stack chat-preview-stack--center">
    <p class="chat-preview__caption">
      {{ pick('带上文案后，按钮会展开，用来说明原因。', 'Labels expand the button to give context') }}
    </p>
    <div class="chat-preview-row chat-preview-row--center">
      <ChatLayoutScrollButton is-visible />
      <ChatLayoutScrollButton is-visible :label="pick('有新消息', 'New messages')" />
      <ChatLayoutScrollButton is-visible :label="pick('3 条未读回复', '3 unread replies')" />
    </div>
  </div>
</template>
