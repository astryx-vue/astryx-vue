<script setup lang="ts">
import type { HomeStageLocale } from './homeStageCopy'
import { Button } from '@astryx-vue/core/Button'
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatToolCalls, ChatTypingIndicator } from '@astryx-vue/core/Chat'
import { TextInput } from '@astryx-vue/core/TextInput'
// @ts-expect-error virtual module from demoSourcePlugin
import { homeCodeSnippets } from 'virtual:home-code-snippets'
import { computed, ref } from 'vue'
import { HOME_STAGE_COPY } from './homeStageCopy'
import { useAutoplayChat } from './useAutoplayChat'

/** 首页右侧自动播放的聊天演示，用户发一句话后停止自动播放。 */
const props = defineProps<{
  locale: HomeStageLocale
}>()

const text = computed(() => HOME_STAGE_COPY[props.locale])
const highlightedSnippet = computed(() => homeCodeSnippets[props.locale]?.html ?? '')

const draft = ref('')

const {
  showUser,
  isTyping,
  showTool,
  showCode,
  showEnding,
  displayedLeadText,
  assistantLabel,
  currentScript,
  customMessages,
  sendUserMessage,
} = useAutoplayChat({
  script: () => text.value.script,
  assistantName: () => text.value.assistantName,
})

function handleSend(): void {
  const value = draft.value.trim()
  if (!value)
    return
  draft.value = ''
  sendUserMessage(value)
}
</script>

<template>
  <ChatLayout class="home-chat">
    <ChatMessageList>
      <ChatMessage v-if="showUser" sender="user" class="astryx-motion-fade-in">
        <ChatMessageBubble>
          {{ currentScript.userQuestion }}
        </ChatMessageBubble>
      </ChatMessage>

      <ChatMessage v-if="isTyping" sender="assistant" class="astryx-motion-fade-in">
        <ChatTypingIndicator :names="[assistantLabel]" />
      </ChatMessage>

      <ChatMessage
        v-if="displayedLeadText || showTool"
        sender="assistant"
        :name="assistantLabel"
        class="astryx-motion-fade-in"
      >
        <ChatToolCalls
          v-if="showTool"
          :calls="[{ name: currentScript.toolName, status: 'complete' }]"
        />

        <ChatMessageBubble v-if="displayedLeadText">
          {{ displayedLeadText }}
        </ChatMessageBubble>

        <div
          v-if="showCode"
          class="home-chat-code astryx-motion-fade-in"
          v-html="highlightedSnippet"
        />

        <ChatMessageBubble v-if="showEnding" class="astryx-motion-fade-in">
          {{ currentScript.assistantEnding }}
        </ChatMessageBubble>
      </ChatMessage>

      <ChatMessage
        v-for="msg in customMessages"
        :key="msg.id"
        :sender="msg.sender"
        class="astryx-motion-fade-in"
      >
        <ChatMessageBubble>
          {{ msg.text }}
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>

    <template #composer>
      <form class="home-composer" @submit.prevent="handleSend">
        <TextInput
          v-model="draft"
          is-label-hidden
          size="sm"
          width="100%"
          :label="text.composer"
          :placeholder="text.placeholder"
          auto-complete="off"
          @enter="handleSend"
        />
        <Button type="submit" size="sm" variant="primary" :label="text.send" />
      </form>
    </template>
  </ChatLayout>
</template>

<style>
html:not(.dark) .home-chat-code .shiki span {
  color: var(--shiki-light, inherit);
}

html.dark .home-chat-code .shiki span {
  color: var(--shiki-dark, inherit);
}
</style>

<style scoped>
.home-chat {
  height: 37.5rem;
  min-height: 24rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-container);
  background: var(--astryx-color-background-card);
  box-shadow: var(--astryx-shadow-med);
}

.home-chat :deep(.astryx-chat-message-list__inner) {
  padding-block: var(--astryx-spacing-3, 12px);
  padding-inline: var(--astryx-spacing-3, 12px);
}

.home-chat :deep(.astryx-chat-layout__blur) {
  display: none;
}

.home-chat :deep(.astryx-chat-layout__composer) {
  padding-block-end: var(--astryx-spacing-2, 8px);
  padding-inline: var(--astryx-spacing-2, 8px);
}

.home-chat :deep(.astryx-chat-message[data-sender='user']) {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--astryx-color-background-card);
}

.home-chat :deep(.astryx-chat-message-bubble) {
  font-size: 0.8125rem;
  line-height: 1.45;
}

.home-chat :deep(.astryx-chat-message-bubble[data-density='compact']),
.home-chat :deep(.astryx-chat-message-bubble[data-density='balanced']) {
  padding-block: 8px;
  padding-inline: 12px;
}

/* 助手标签与内容紧凑对齐 */
.home-chat :deep(.astryx-chat-message__name),
.home-chat :deep(.astryx-chat-message-bubble__name) {
  margin-block-end: 2px;
}

.home-chat :deep(.astryx-chat-tool-calls) {
  margin-block-start: 2px;
}

.home-chat :deep(.astryx-chat-message__body) {
  gap: var(--astryx-spacing-2, 8px);
}

.home-chat-code {
  box-sizing: border-box;
  width: 100%;
  margin-top: var(--astryx-spacing-1, 4px);
  overflow-x: auto;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-element, 0.625rem);
  background: var(--astryx-color-background-surface);
  font-family: var(--astryx-font-family-code);
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--astryx-color-text-primary);
}

.home-chat-code :deep(div[class*='language-']) {
  margin: 0;
  border-radius: inherit;
  background: transparent;
}

.home-chat-code :deep(button.copy),
.home-chat-code :deep(span.lang) {
  display: none;
}

.home-chat-code :deep(pre.shiki) {
  margin: 0;
  padding: 10px 12px;
  background: transparent !important;
  font-size: 0.78rem;
  line-height: 1.4;
  font-family: inherit;
}

.home-chat-code :deep(code) {
  font-family: inherit;
  font-size: inherit;
}

.home-composer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.65rem;
  width: 100%;
}

.home-composer :deep(.astryx-field) {
  flex: 1 1 12rem;
  min-width: 0;
}

@media (width >= 960px) {
  .home-chat {
    height: 37.5rem;
  }
}

@media (width < 960px) {
  .home-chat {
    height: 40.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .astryx-motion-fade-in {
    animation: none;
  }
}
</style>
