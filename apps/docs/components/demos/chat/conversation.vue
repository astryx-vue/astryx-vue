<script setup lang="ts">
import type { ChatToolCallItem } from '@astryx-vue/core/Chat'
import { Button } from '@astryx-vue/core/Button'
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatMessageMetadata, ChatReasoning, ChatSystemMessage, ChatToolCalls, ChatTypingIndicator, ChatUnreadDivider } from '@astryx-vue/core/Chat'
import { Citation } from '@astryx-vue/core/Citation'
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()

const answer = computed(() => pick(
  '发布说明里写了两处变化：离开底部后会出现回到底部的按钮，新到的消息会单独标出来。',
  'The notes mention two changes: a button brings you back once you leave the bottom, and new messages are marked on their own.',
))
const shown = ref(0)
const draft = ref('')
const followUp = ref('')
const sent = ref<{ id: number, text: string }[]>([])

const assistantText = computed(() => answer.value.slice(0, shown.value))
const streaming = computed(() => shown.value < answer.value.length)
const toolCalls = computed<ChatToolCallItem[]>(() => [
  {
    name: 'search_docs',
    status: 'complete',
    target: 'notes.md',
    duration: '0.4s',
    detail: pick('命中发布说明一节。', 'Matched the release section.'),
  },
  {
    name: 'read_file',
    status: 'running',
    target: 'CHANGELOG.md',
  },
])

let streamTimer = 0
let followTimer = 0
let nextId = 1

function send(): void {
  const text = draft.value.trim()
  if (text === '')
    return

  sent.value.push({ id: nextId, text })
  nextId += 1
  draft.value = ''

  const reply = pick('收到，我接着看。', 'Got it. I will keep reading.')
  followUp.value = ''
  window.clearInterval(followTimer)
  let index = 0
  followTimer = window.setInterval(() => {
    index += 1
    followUp.value = reply.slice(0, index)
    if (index >= reply.length)
      window.clearInterval(followTimer)
  }, 32)
}

onMounted(() => {
  streamTimer = window.setInterval(() => {
    if (shown.value >= answer.value.length) {
      window.clearInterval(streamTimer)
      return
    }
    shown.value += 1
  }, 28)
})

onScopeDispose(() => {
  window.clearInterval(streamTimer)
  window.clearInterval(followTimer)
})
</script>

<template>
  <div class="chat-preview">
    <ChatLayout class="chat-preview__layout" density="compact">
      <ChatMessageList :is-streaming="streaming">
        <ChatSystemMessage variant="divider">
          {{ pick('会话已开始', 'Session started') }}
        </ChatSystemMessage>

        <ChatMessage sender="user">
          <ChatMessageBubble>
            {{ pick('帮我看一下发布说明。', 'Check the release notes for me.') }}
          </ChatMessageBubble>
          <template #metadata>
            <ChatMessageMetadata status="read" timestamp="09:41" />
          </template>
        </ChatMessage>

        <ChatMessage sender="assistant">
          <ChatReasoning duration="4s">
            {{ pick('先检索文档，再打开变更记录。', 'Search the docs, then open the changelog.') }}
          </ChatReasoning>
          <ChatToolCalls :calls="toolCalls" />
          <ChatMessageBubble :name="pick('助手', 'Assistant')">
            <p class="chat-preview__answer">
              {{ assistantText }}
              <Citation
                :number="1"
                :source="{ title: pick('发布说明', 'Release notes'), url: 'https://example.com/notes' }"
              />
            </p>
          </ChatMessageBubble>
          <template #metadata>
            <ChatMessageMetadata footer="fig-small" timestamp="09:41" />
          </template>
        </ChatMessage>

        <ChatUnreadDivider />

        <ChatMessage sender="assistant">
          <ChatMessageBubble>
            {{ pick('变更记录里还有一条没打开。', 'One changelog entry is still unread.') }}
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage v-for="line in sent" :key="line.id" sender="user">
          <ChatMessageBubble>
            {{ line.text }}
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage v-if="sent.length > 0" sender="assistant">
          <ChatMessageBubble>
            {{ followUp }}
          </ChatMessageBubble>
        </ChatMessage>

        <ChatTypingIndicator :names="[pick('阿青', 'Alex')]" />
      </ChatMessageList>

      <template #composer>
        <form class="chat-preview__composer" @submit.prevent="send">
          <input
            v-model="draft"
            class="chat-preview__input"
            type="text"
            :aria-label="pick('消息', 'Message')"
            :placeholder="pick('输入消息', 'Write a message')"
          >
          <Button type="submit" variant="primary" :label="pick('发送', 'Send')" />
        </form>
      </template>
    </ChatLayout>
  </div>
</template>
