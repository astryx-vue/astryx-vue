<script setup lang="ts">
import { useClipboard } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatToolCalls, ChatTypingIndicator } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, ref } from 'vue'
import { useAutoplayChat } from './useAutoplayChat'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

const install = 'pnpm add @astryx-vue/core @astryx-vue/themes'

const copy = {
  zh: {
    mark: 'astryx-vue',
    title: '用 Vue 重新实现 Astryx 设计语言',
    lede: '非官方社区项目。token、CSS 变量、动画和组件粒度按原版对齐，接口是 props、事件、插槽和组合式函数。',
    start: '快速开始',
    components: '浏览组件',
    copy: '复制安装命令',
    copied: '已复制安装命令',
    assistantName: '助手',
    composer: '写一句',
    placeholder: '输入消息...',
    send: '发送',
    script: {
      userQuestion: 'astryx 设计语言是否有 Vue 版本实现的组件库？',
      toolName: 'pnpm add @astryx-vue/core @astryx-vue/themes',
      assistantLead: '有的，astryx-vue 就是面向 Vue 3 的社区实现。底层严格对齐 design token、CSS 变量与动画刻度，按 Vue 规范提供原生组件：',
      codeSnippet: `<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
<\/script>

<template>
  <Button variant="primary" label="快速开始" />
</template>`,
      assistantEnding: '组件按需加载结构样式，Neutral 主题天然支持深浅色模式。',
    },
  },
  en: {
    mark: 'astryx-vue',
    title: 'Astryx design language, reimplemented for Vue',
    lede: 'An unofficial community project. Tokens, CSS variables, motion, and component grain follow Astryx. The API is native props, events, slots, and composables.',
    start: 'Quick start',
    components: 'Browse components',
    copy: 'Copy install command',
    copied: 'Copied install command',
    assistantName: 'Assistant',
    composer: 'Message',
    placeholder: 'Type a message...',
    send: 'Send',
    script: {
      userQuestion: 'Is there a Vue component library implementing the Astryx design language?',
      toolName: 'pnpm add @astryx-vue/core @astryx-vue/themes',
      assistantLead: 'Yes, astryx-vue is the community implementation for Vue 3. It faithfully replicates design tokens, CSS variables, and motion scales with native components:',
      codeSnippet: `<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
<\/script>

<template>
  <Button variant="primary" label="Quick start" />
</template>`,
      assistantEnding: 'Components load their own structural styles, and theme variables support light and dark mode.',
    },
  },
} as const

const text = computed(() => copy[props.locale])
const prefix = computed(() => props.locale === 'en' ? '/en' : '')
const clipboard = useClipboard({ announce: text.value.copied })

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

async function copyInstall(): Promise<void> {
  await clipboard.copy(install)
}

function handleSend(): void {
  const value = draft.value.trim()
  if (!value)
    return
  draft.value = ''
  sendUserMessage(value)
}
</script>

<template>
  <div class="home-stage">
    <section class="home-press" aria-labelledby="home-title">
      <div class="home-mark" role="img" :aria-label="text.mark">
        <span class="home-mark__logo" />
      </div>

      <div class="home-copy">
        <h1 id="home-title">
          {{ text.title }}
        </h1>
        <p class="home-lede">
          {{ text.lede }}
        </p>
        <div class="home-actions">
          <Button variant="primary" :href="`${prefix}/guide/getting-started`" :label="text.start" />
          <Button variant="secondary" :href="`${prefix}/components/`" :label="text.components" />
        </div>
        <div class="home-install">
          <code>{{ install }}</code>
          <IconButton
            class="home-copy-btn"
            size="sm"
            variant="ghost"
            :label="clipboard.isCopied.value ? text.copied : text.copy"
            @click="copyInstall"
          >
            <span
              class="home-copy-icon"
              :class="clipboard.isCopied.value ? 'i-carbon-checkmark' : 'i-carbon-copy'"
              aria-hidden="true"
            />
          </IconButton>
        </div>
      </div>

      <div class="home-chat-column">
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

              <div v-if="showCode" class="home-chat-code astryx-motion-fade-in">
                <pre><code>{{ currentScript.codeSnippet }}</code></pre>
              </div>

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
      </div>
    </section>
  </div>
</template>

<style>
html:has(.home-stage),
.page-home {
  --vp-nav-bg-color: var(--astryx-color-background-body) !important;
  --vp-nav-home-bg-color: var(--astryx-color-background-body) !important;
  --astryx-bg: var(--astryx-color-background-body) !important;
}

html:has(.home-stage),
html:has(.home-stage) body,
html:has(.home-stage) .VPNav,
html:has(.home-stage) .VPNavBar,
html:has(.home-stage) .VPNavBar::before,
html:has(.home-stage) .VPContent,
html:has(.home-stage) .VPPage,
.page-home,
.page-home body,
.page-home .VPNav,
.page-home .VPNavBar,
.page-home .VPNavBar::before,
.page-home .VPContent,
.page-home .VPPage {
  background: var(--astryx-color-background-body) !important;
  background-color: var(--astryx-color-background-body) !important;
  box-shadow: none !important;
}

html:has(.home-stage) .VPNav,
.page-home .VPNav {
  border-bottom: 1px solid var(--astryx-color-border) !important;
}

html:has(.home-stage) .home-stage :where(a, button, input, textarea, select, summary):focus-visible,
.page-home .home-stage :where(a, button, input, textarea, select, summary):focus-visible {
  outline-color: var(--astryx-focus-outline-color);
}
</style>

<style scoped>
.home-stage {
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-body);
  background: var(--astryx-color-background-body);
}

.home-press {
  display: grid;
  grid-template-areas:
    "mark"
    "copy"
    "chat";
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  width: min(1200px, calc(100% - 2.5rem));
  min-height: calc(100svh - var(--vp-nav-height));
  margin: 0 auto;
  padding: clamp(3.5rem, 6vw, 5.5rem) 0 4rem;
  box-sizing: border-box;
}

.home-mark {
  grid-area: mark;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}

.home-mark__logo {
  display: block;
  width: min(100%, 28rem);
  aspect-ratio: 1060 / 200;
  margin: 0 auto;
  background: var(--astryx-color-text-primary);
  mask: url('/full-text-logo.svg') center / contain no-repeat;
}

.home-copy {
  grid-area: copy;
  max-width: 38rem;
}

.home-copy h1 {
  margin: 0;
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-heading);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-wrap: balance;
  font-size: clamp(2rem, 4.2vw, 3.25rem);
}

.home-lede {
  margin: 1rem 0 0;
  color: var(--astryx-color-text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 38rem;
}

.home-actions,
.home-composer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.home-actions {
  margin-top: 1.5rem;
}

.home-install {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  max-width: 100%;
  box-sizing: border-box;
  margin-top: 1.25rem;
  padding: 0.3rem 0.35rem 0.3rem 0.85rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-inner);
  background: var(--astryx-color-background-muted);
}

.home-install code {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  font-family: var(--astryx-font-family-code);
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--astryx-color-text-primary);
  background: transparent;
  padding: 0;
}

.home-install code::-webkit-scrollbar {
  display: none;
}

.home-copy-btn {
  flex-shrink: 0;
}

.home-copy-icon {
  width: 1rem;
  height: 1rem;
}

.home-chat-column {
  grid-area: chat;
  min-width: 0;
}

.home-chat {
  height: min(28rem, 64svh);
  min-height: 22rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-container);
  background: var(--astryx-color-background-card);
  box-shadow: var(--astryx-shadow-med);
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
  padding: var(--astryx-spacing-3, 12px);
  overflow-x: auto;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-element, 0.625rem);
  background: var(--astryx-color-background-surface);
  font-family: var(--astryx-font-family-code);
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--astryx-color-text-primary);
}

.home-chat-code pre {
  margin: 0;
  white-space: pre;
}

.home-chat-code code {
  font-family: inherit;
  font-size: inherit;
}

.home-composer {
  align-items: flex-end;
  width: 100%;
}

.home-composer :deep(.astryx-field) {
  flex: 1 1 12rem;
  min-width: 0;
}

@media (width >= 960px) {
  .home-press {
    grid-template-areas:
      "mark mark"
      "copy chat";
    grid-template-columns: minmax(0, 0.95fr) minmax(20rem, 1.05fr);
    gap: 2rem 3.5rem;
    align-items: start;
    padding-top: clamp(4rem, 6.5vw, 6rem);
    padding-bottom: 4rem;
  }

  .home-chat {
    height: min(28rem, 60svh);
  }

  .home-mark__logo {
    width: min(44vw, 29rem);
  }
}

@media (width < 960px) {
  .home-press {
    padding-top: 3.5rem;
    gap: 1.75rem;
  }

  .home-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .home-actions :deep(.astryx-button) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .astryx-motion-fade-in {
    animation: none;
  }
}
</style>
