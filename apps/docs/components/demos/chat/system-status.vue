<script setup lang="ts">
import { ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <ChatMessageList>
    <ChatSystemMessage variant="divider">
      {{ pick('2026年3月14日', 'March 14, 2026') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-heroicons-user-plus" style="width: 20px; height: 20px" />
      </template>
      {{ pick('陈晓加入了会话', 'Sarah Chen joined the conversation') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      {{ pick('话题已改为「二季度发布计划」', 'Topic changed to "Q2 Launch Planning"') }}
    </ChatSystemMessage>
    <ChatSystemMessage variant="divider">
      {{ pick('2026年3月15日', 'March 15, 2026') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-heroicons-user-minus" style="width: 20px; height: 20px" />
      </template>
      {{ pick('林川离开了会话', 'Alex Rivera left the conversation') }}
    </ChatSystemMessage>
    <ChatSystemMessage variant="divider">
      {{ pick('今天', 'Today') }}
    </ChatSystemMessage>
    <ChatSystemMessage>
      <template #icon>
        <span class="i-heroicons-check-circle" style="width: 20px; height: 20px" />
      </template>
      {{ pick('会话已标为已解决', 'Conversation marked as resolved') }}
    </ChatSystemMessage>
  </ChatMessageList>
</template>
