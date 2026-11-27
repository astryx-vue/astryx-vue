<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { Icon } from '@astryx-vue/core/Icon'
import { Timestamp } from '@astryx-vue/core/Timestamp'
</script>

<template>
  <ChatMessageList>
    <ChatMessage sender="assistant">
      <ChatMessageBubble>
        Sorry, something went wrong on my end.
        <template #metadata>
          <ChatMessageMetadata status="error">
            <template #timestamp>
              <Timestamp value="2026-03-15T14:30:00" format="time" />
            </template>
            <template #footer>
              <Button label="Retry" variant="ghost" size="sm" is-icon-only>
                <template #icon>
                  <Icon icon="i-heroicons-arrow-path" size="sm" />
                </template>
              </Button>
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="user">
      <ChatMessageBubble>
        No worries — try again.
        <template #metadata>
          <ChatMessageMetadata status="read">
            <template #timestamp>
              <Timestamp value="2026-03-15T14:31:00" format="time" />
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
