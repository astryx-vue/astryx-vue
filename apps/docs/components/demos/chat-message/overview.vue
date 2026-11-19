<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata } from '@astryx-vue/core/Chat'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'
</script>

<template>
  <ChatMessageList style="max-width: 600px">
    <ChatMessage sender="user">
      <ChatMessageBubble group="first">
        I just pushed the refactored auth module.
      </ChatMessageBubble>
      <ChatMessageBubble group="last">
        Can you review the token validation changes?
        <template #metadata>
          <ChatMessageMetadata status="read">
            <template #timestamp>
              <Timestamp value="2026-04-28T14:30:00" format="time" />
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
    <ChatMessage sender="assistant">
      <ChatMessageBubble variant="ghost">
        Looks good — the refresh token rotation is solid and the error handling covers all the edge cases. Ship it.
        <template #metadata>
          <ChatMessageMetadata>
            <template #timestamp>
              <Timestamp value="2026-04-28T14:31:00" format="time" />
            </template>
            <template #footer>
              <Text type="supporting" color="secondary">
                Claude Opus 4.6
              </Text>
            </template>
          </ChatMessageMetadata>
        </template>
      </ChatMessageBubble>
    </ChatMessage>
  </ChatMessageList>
</template>
