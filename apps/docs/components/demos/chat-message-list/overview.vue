<script setup lang="ts">
import { ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'
import { Timestamp } from '@astryx-vue/core/Timestamp'
</script>

<template>
  <VStack class="chat-message-list-showcase" style="max-width: 600px">
    <ChatMessageList density="balanced">
      <ChatSystemMessage variant="divider">
        March 15, 2026
      </ChatSystemMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          How should I structure a monorepo?
          <template #metadata>
            <ChatMessageMetadata status="read">
              <template #timestamp>
                <Timestamp value="2026-03-15T14:30:00" format="time" />
              </template>
            </ChatMessageMetadata>
          </template>
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble>
          Use workspaces with a shared packages directory. Keep each package focused on a single concern.
          <template #metadata>
            <ChatMessageMetadata>
              <template #timestamp>
                <Timestamp value="2026-03-15T14:30:15" format="time" />
              </template>
            </ChatMessageMetadata>
          </template>
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>
          Should I use Yarn or pnpm for that?
          <template #metadata>
            <ChatMessageMetadata status="delivered">
              <template #timestamp>
                <Timestamp value="2026-03-15T14:31:00" format="time" />
              </template>
            </ChatMessageMetadata>
          </template>
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  </VStack>
</template>

<style scoped>
/* 原版 height: 100%：桌面撑满 16:9 的画布，消息贴着底部排；窄屏画布随内容长高，百分比不生效。 */
.chat-message-list-showcase {
  height: 100%;
}
</style>
