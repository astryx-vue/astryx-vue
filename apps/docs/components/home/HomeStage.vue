<script setup lang="ts">
import { useClipboard } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatToolCalls, ChatTypingIndicator } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
import { TextInput } from '@astryx-vue/core/TextInput'
// @ts-expect-error virtual module from demoSourcePlugin
import { homeCodeSnippets } from 'virtual:home-code-snippets'
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
    start: '快速开始',
    components: '浏览组件',
    copy: '复制安装命令',
    copied: '已复制安装命令',
    assistantName: '助手',
    composer: '写一句...',
    placeholder: '写一句...',
    send: '发送',
    script: {
      userQuestion: 'Astryx 设计语言有对应的 Vue 组件库吗？',
      toolName: 'pnpm add @astryx-vue/core @astryx-vue/themes',
      assistantLead: '有的！astryx-vue 就是专门为 Vue 3 开发的社区开源版本。它把颜色、排版、间距和动效细节都原汁原味还原了过来，写起来就是大家熟悉的 Vue 组件用法：',
      codeSnippet: `<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
<\/script>

<template>
  <Button variant="primary" label="快速开始" />
</template>`,
      assistantEnding: '按上面的方式把样式和组件引进来就能用啦，挑个组件去你的页面里试试看吧！',
    },
    features: [
      {
        title: '做工扎实的设计系统',
        subtitle: '吸收了 Meta 设计规范的精细做工，不管是颜色、间距还是动效过渡，每一处细节都耐看好用。',
      },
      {
        title: '常用组件一应俱全',
        subtitle: '从小巧的按钮、输入框，到现成的整套 AI 对话窗口，日常做页面要用的零件都备齐了。',
      },
      {
        title: '有现成模板，也有演练场',
        subtitle: '提供整套可以直接参考的页面例子，还有在线演练场供你随手调试，做页面不用从零猜效果。',
      },
    ],
  },
  en: {
    mark: 'astryx-vue',
    title: 'Astryx design language, reimplemented for Vue',
    start: 'Quick start',
    components: 'Browse components',
    copy: 'Copy install command',
    copied: 'Copied install command',
    assistantName: 'Assistant',
    composer: 'Message...',
    placeholder: 'Message...',
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
      assistantEnding: 'Ready to start using astryx-vue? It won\'t let you down.',
    },
    features: [
      {
        title: 'Battle-tested design system',
        subtitle: 'Proven at Meta scale, faithfully aligned with design tokens, CSS variables, and motion scales.',
      },
      {
        title: 'Rich component library',
        subtitle: 'From essential foundational controls to complex AI chat layouts for modern web apps.',
      },
      {
        title: 'Scenario-driven use cases',
        subtitle: 'Production-ready templates and an interactive playground to ship complete pages faster.',
      },
    ],
  },
} as const

const text = computed(() => copy[props.locale])
const prefix = computed(() => props.locale === 'en' ? '/en' : '')
const clipboard = useClipboard({ announce: text.value.copied })
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

        <div class="home-features">
          <div
            v-for="feat in text.features"
            :key="feat.title"
            class="home-feature-item"
          >
            <h2 class="home-feature-title">
              {{ feat.title }}
            </h2>
            <p class="home-feature-subtitle">
              {{ feat.subtitle }}
            </p>
          </div>
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

html:not(.dark) .home-chat-code .shiki span {
  color: var(--shiki-light, inherit);
}

html.dark .home-chat-code .shiki span {
  color: var(--shiki-dark, inherit);
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

.home-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(2rem, 4vw, 2.75rem);
  border-top: 1px solid var(--astryx-color-border);
}

.home-feature-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.home-feature-title {
  margin: 0;
  font-family: var(--astryx-font-family-heading);
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--astryx-color-text-primary);
  letter-spacing: -0.015em;
}

.home-feature-subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--astryx-color-text-secondary);
}

.home-chat-column {
  grid-area: chat;
  min-width: 0;
}

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
    height: 37.5rem;
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
