<script setup lang="ts">
import { ChatComposer, ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatTokenizedText } from '@astryx-vue/core/Chat'
import { VStack } from '@astryx-vue/core/Stack'

const tokens = [{ value: '/review', label: '/review', variant: 'blue' as const }]
</script>

<template>
  <VStack :width="450" max-width="100%">
    <ChatLayout>
      <ChatMessageList>
        <ChatMessage sender="user">
          <ChatMessageBubble>
            <ChatTokenizedText text="/review the changes in this file" :tokens="tokens" />
          </ChatMessageBubble>
        </ChatMessage>
        <ChatMessage sender="assistant">
          <ChatMessageBubble variant="ghost">
            Reading the file now...
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
      <template #composer>
        <ChatComposer placeholder="Ask something..." />
      </template>
    </ChatLayout>
  </VStack>
</template>
