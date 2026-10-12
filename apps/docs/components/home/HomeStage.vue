<script setup lang="ts">
import { useClipboard } from '@astryx-vue/core'
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { ChatLayout, ChatMessage, ChatMessageBubble, ChatMessageList, ChatSystemMessage } from '@astryx-vue/core/Chat'
import { IconButton } from '@astryx-vue/core/IconButton'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, ref, shallowRef } from 'vue'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

const install = 'pnpm add @astryx-vue/core @astryx-vue/themes'

const copy = {
  zh: {
    mark: 'astryx-vue',
    title: '用 Vue 重新实现 Astryx 的设计语言',
    lede: '非官方社区项目。token、CSS 变量、动画和组件粒度按原版对齐，接口是 props、事件、插槽和组合式函数。',
    start: '快速开始',
    components: '浏览组件',
    copy: '复制',
    copied: '已复制',
    search: '搜索输入框',
    copyIcon: '复制安装命令',
    themes: '主题',
    announce: '已复制安装命令',
    preview: '页面预览',
    user: '这套颜色从哪来？',
    assistant: '从 Neutral 的 CSS 变量来。浅色和深色写在同一个 light-dark() 里。',
    assistantName: '助手',
    caption: '这段对话只留在本页，没有接到模型。',
    composer: '写一句',
    placeholder: '只加到上面的记录里',
    send: '发送',
    tray: '组件和 token 样例',
    motion: '缩放',
    replay: '再播一次',
    ghost: '轻量',
    destructive: '危险',
    swatchLabel: '色板',
    rampTitle: '颜色就是 token',
    rampBody: 'Neutral 把浅色和深色放在同一条 CSS 变量里。下面这条色带是 background 色，不是单独画的插图。',
    rampLink: '看全部颜色',
    notesTitle: 'Vue 的写法，不是 React 的外壳',
    notes: [
      { term: 'CSS 变量', body: '语义值都是 --astryx-*，颜色用 light-dark()。组件结构样式和主题分成两层。', href: '/themes/css-variables', link: '变量怎么分层' },
      { term: '动画', body: '时长三档，一条标准缓动。共享的淡入、缩放和四向滑动会听从系统的减少动态效果。', href: '/themes/motion', link: '看动画刻度' },
      { term: '组合式函数', body: 'useClipboard、useControllableState、useAnnounce 这一类从 @astryx-vue/core 引入。上面的复制按钮用的就是 useClipboard。', href: '/guide/composables', link: '函数列表' },
      { term: 'CSS 图标', body: '没有内置图标组件。IconButton 和 NavItem 接收一个 CSS class，图形由调用方绘制。', href: '/guide/icons', link: '图标方案' },
      { term: '对话', body: 'Chat、Citation、Markdown 按组件拆开，由应用自己拼。这一页的记录是 ChatLayout。', href: '/guide/patterns', link: '应用模式' },
    ],
    endTitle: '两个包',
    endBody: '@astryx-vue/core 提供组件，@astryx-vue/themes 提供 Neutral。主题目前只有这一套。',
    why: '为什么这样做',
  },
  en: {
    mark: 'astryx-vue',
    title: 'The Astryx design language, rebuilt for Vue',
    lede: 'An unofficial community project. Tokens, CSS variables, motion, and component grain follow Astryx. The API is props, events, slots, and composables.',
    start: 'Quick start',
    components: 'Browse components',
    copy: 'Copy',
    copied: 'Copied',
    search: 'Focus the message field',
    copyIcon: 'Copy install command',
    themes: 'Themes',
    announce: 'Copied the install command',
    preview: 'On this page',
    user: 'Where do these colors come from?',
    assistant: 'From Neutral CSS variables. Light and dark live in the same light-dark() value.',
    assistantName: 'Assistant',
    caption: 'This transcript stays on the page. It does not call a model.',
    composer: 'Write a line',
    placeholder: 'It is only added to the transcript above',
    send: 'Send',
    tray: 'Component and token samples',
    motion: 'Scale',
    replay: 'Replay',
    ghost: 'Ghost',
    destructive: 'Destructive',
    swatchLabel: 'Swatches',
    rampTitle: 'Color is the token',
    rampBody: 'Neutral keeps light and dark on one CSS variable. The band below is the background tokens, not a separate illustration.',
    rampLink: 'See every color',
    notesTitle: 'A Vue API, not a React shell',
    notes: [
      { term: 'CSS variables', body: 'Semantic values are --astryx-*. Colors use light-dark(). Structure and theme are separate layers.', href: '/en/themes/css-variables', link: 'How the layers work' },
      { term: 'Motion', body: 'Three durations and one standard ease. The shared fade, scale, and four-way slides follow reduced motion.', href: '/en/themes/motion', link: 'See the scale' },
      { term: 'Composables', body: 'useClipboard, useControllableState, and useAnnounce come from @astryx-vue/core. The copy button above is useClipboard.', href: '/en/guide/composables', link: 'Function list' },
      { term: 'CSS icons', body: 'There is no built-in icon set. IconButton and NavItem take a CSS class, and the app draws the glyph.', href: '/en/guide/icons', link: 'Icon approach' },
      { term: 'Conversation', body: 'Chat, Citation, and Markdown stay separate components. The transcript on this page is ChatLayout.', href: '/en/guide/patterns', link: 'Patterns' },
    ],
    endTitle: 'Two packages',
    endBody: '@astryx-vue/core is the components. @astryx-vue/themes is Neutral. That is the only theme shipped today.',
    why: 'Why it is built this way',
  },
} as const

const text = computed(() => copy[props.locale])
const prefix = computed(() => props.locale === 'en' ? '/en' : '')
const clipboard = useClipboard({ announce: text.value.announce })
const draft = ref('')
const playId = ref(0)
const composer = ref<{ focus: () => void } | null>(null)
let nextId = 3

interface Line {
  id: number
  sender: 'user' | 'assistant'
  text: string
}

const lines = shallowRef<Line[]>([
  { id: 1, sender: 'user', text: text.value.user },
  { id: 2, sender: 'assistant', text: text.value.assistant },
])

const copiedLabel = computed(() => clipboard.isCopied.value ? text.value.copied : text.value.copy)

const ramps = [
  '--astryx-color-background-blue',
  '--astryx-color-background-cyan',
  '--astryx-color-background-teal',
  '--astryx-color-background-green',
  '--astryx-color-background-yellow',
  '--astryx-color-background-orange',
  '--astryx-color-background-red',
  '--astryx-color-background-pink',
  '--astryx-color-background-purple',
]

async function copyInstall(): Promise<void> {
  await clipboard.copy(install)
}

function focusComposer(): void {
  composer.value?.focus()
}

function send(): void {
  const value = draft.value.trim()
  if (value === '')
    return
  draft.value = ''
  lines.value = [...lines.value, { id: nextId, sender: 'user', text: value }]
  nextId += 1
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
          <Button size="sm" variant="secondary" :label="copiedLabel" @click="copyInstall" />
        </div>
      </div>

      <div class="home-chat-column">
        <ChatLayout class="home-chat">
          <ChatMessageList>
            <ChatSystemMessage variant="divider">
              {{ text.preview }}
            </ChatSystemMessage>
            <ChatMessage v-for="line in lines" :key="line.id" :sender="line.sender">
              <ChatMessageBubble v-if="line.sender === 'user'">
                {{ line.text }}
              </ChatMessageBubble>
              <ChatMessageBubble v-else :name="text.assistantName">
                {{ line.text }}
              </ChatMessageBubble>
            </ChatMessage>
          </ChatMessageList>
          <template #composer>
            <form class="home-composer" @submit.prevent="send">
              <TextInput
                ref="composer"
                v-model="draft"
                is-label-hidden
                size="sm"
                width="100%"
                :label="text.composer"
                :placeholder="text.placeholder"
                auto-complete="off"
                @enter="send"
              />
              <Button type="submit" size="sm" variant="primary" :label="text.send" />
            </form>
          </template>
        </ChatLayout>
        <p class="home-caption">
          {{ text.caption }}
        </p>
      </div>

      <div class="home-tray" :aria-label="text.tray">
        <Button size="sm" variant="ghost" :label="text.ghost" />
        <Button size="sm" variant="destructive" :label="text.destructive" />
        <Badge>Neutral</Badge>
        <Badge variant="blue">
          CSS
        </Badge>
        <IconButton :label="text.search" @click="focusComposer">
          <span class="i-carbon-search" />
        </IconButton>
        <IconButton :label="text.copyIcon" @click="copyInstall">
          <span class="i-carbon-copy" />
        </IconButton>
        <IconButton :href="`${prefix}/themes/`" :label="text.themes">
          <span class="i-carbon-color-palette" />
        </IconButton>
        <span class="home-swatches">
          <span class="home-swatches__name">{{ text.swatchLabel }}</span>
          <span class="home-swatches__row" aria-hidden="true">
            <span
              v-for="name in ramps"
              :key="name"
              class="home-swatches__chip"
              :style="{ background: `var(${name})` }"
            />
          </span>
        </span>
        <span class="home-motion">
          <span :key="playId" class="home-motion__chip astryx-motion-scale-in">{{ text.motion }}</span>
          <Button size="sm" variant="ghost" :label="text.replay" @click="playId += 1" />
        </span>
      </div>
    </section>

    <section class="home-ramp" aria-labelledby="home-ramp-title">
      <div class="home-ramp__copy">
        <h2 id="home-ramp-title">
          {{ text.rampTitle }}
        </h2>
        <p>{{ text.rampBody }}</p>
        <a class="home-link" :href="`${prefix}/themes/color`">{{ text.rampLink }}</a>
      </div>
      <div class="home-ramp__bar" role="img" :aria-label="ramps.join(' ')">
        <span
          v-for="name in ramps"
          :key="name"
          :style="{ background: `var(${name})` }"
        />
      </div>
    </section>

    <section class="home-notes" aria-labelledby="home-notes-title">
      <h2 id="home-notes-title">
        {{ text.notesTitle }}
      </h2>
      <dl>
        <div v-for="note in text.notes" :key="note.term">
          <dt>{{ note.term }}</dt>
          <dd>
            <p>{{ note.body }}</p>
            <a class="home-link" :href="note.href">{{ note.link }}</a>
          </dd>
        </div>
      </dl>
      <div class="home-end">
        <h2>{{ text.endTitle }}</h2>
        <p>{{ text.endBody }}</p>
        <a class="home-link" :href="`${prefix}/guide/why`">{{ text.why }}</a>
      </div>
    </section>
  </div>
</template>

<style>
html:has(.home-stage),
html:has(.home-stage) body,
html:has(.home-stage) .VPNav,
html:has(.home-stage) .VPContent,
html:has(.home-stage) .VPPage {
  background: var(--astryx-color-background-body);
}

html:has(.home-stage) .home-stage :where(a, button, input, textarea, select, summary):focus-visible {
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
    "chat"
    "tray";
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  width: min(1120px, calc(100% - 2rem));
  min-height: calc(100svh - var(--vp-nav-height));
  margin: 0 auto;
  padding: 1.75rem 0 2.5rem;
  box-sizing: border-box;
}

.home-mark {
  grid-area: mark;
}

.home-mark__logo {
  display: block;
  width: min(100%, 28rem);
  aspect-ratio: 1060 / 200;
  background: var(--astryx-color-text-primary);
  mask: url('/full-text-logo.svg') center / contain no-repeat;
}

.home-copy {
  grid-area: copy;
  max-width: 38rem;
}

.home-copy h1,
.home-ramp h2,
.home-notes h2 {
  margin: 0;
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-heading);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-wrap: balance;
}

.home-copy h1 {
  font-size: clamp(2rem, 4.6vw, 3.25rem);
}

.home-lede,
.home-caption,
.home-ramp p,
.home-notes p,
.home-end p {
  margin: 0.85rem 0 0;
  color: var(--astryx-color-text-secondary);
  font-size: 1.05rem;
  line-height: 1.55;
}

.home-lede {
  max-width: 38rem;
}

.home-actions,
.home-install,
.home-tray,
.home-motion,
.home-swatches,
.home-composer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.home-actions,
.home-install {
  margin-top: 1.25rem;
}

.home-install code {
  padding: 0.45rem 0.7rem;
  border-radius: var(--astryx-radius-inner);
  background: var(--astryx-color-background-muted);
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-code);
  font-size: 0.8125rem;
  line-height: 1.4;
}

.home-chat-column {
  grid-area: chat;
  min-width: 0;
}

.home-chat {
  height: min(22rem, 64svh);
  min-height: 18rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-container);
  background: var(--astryx-color-background-card);
  box-shadow: var(--astryx-shadow-med);
}

.home-caption {
  font-size: 0.875rem;
}

.home-composer {
  align-items: flex-end;
  width: 100%;
}

.home-composer :deep(.astryx-field) {
  flex: 1 1 12rem;
  min-width: 0;
}

.home-tray {
  grid-area: tray;
  align-items: center;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-container);
  background: var(--astryx-color-background-surface);
  box-shadow: var(--astryx-shadow-low);
}

.home-swatches__name,
.home-motion__chip {
  color: var(--astryx-color-text-secondary);
  font-size: 0.8125rem;
}

.home-swatches__row {
  display: inline-flex;
  gap: 0.3rem;
}

.home-swatches__chip {
  width: 0.9rem;
  height: 0.9rem;
  border: 1px solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-full);
}

.home-motion__chip {
  display: inline-flex;
  align-items: center;
  min-width: 4.5rem;
  min-height: 1.75rem;
  padding: 0 0.7rem;
  border-radius: var(--astryx-radius-full);
  background: var(--astryx-color-background-blue);
  color: var(--astryx-color-text-blue);
  justify-content: center;
}

.home-ramp,
.home-notes {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 3.5rem 0;
}

.home-ramp {
  display: grid;
  gap: 1.5rem;
}

.home-ramp__copy,
.home-notes,
.home-end {
  max-width: 68ch;
}

.home-ramp h2,
.home-notes h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
}

.home-ramp__bar {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  height: 5.5rem;
  overflow: hidden;
  border-radius: var(--astryx-radius-page);
}

.home-link {
  display: inline-block;
  margin-top: 0.8rem;
  color: var(--astryx-color-text-blue);
  font-size: 1rem;
  text-underline-offset: 0.18em;
}

.home-link:hover {
  color: var(--astryx-color-icon-blue);
}

.home-notes dl {
  margin: 1.75rem 0 0;
}

.home-notes dl > div {
  display: grid;
  gap: 0.35rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--astryx-color-border);
}

.home-notes dt {
  color: var(--astryx-color-text-primary);
  font-size: 1.15rem;
  font-weight: 500;
}

.home-notes dd {
  margin: 0;
}

.home-end {
  margin-top: 2.5rem;
  padding-top: 0.25rem;
}

@media (width >= 960px) {
  .home-press {
    grid-template-areas:
      "mark mark"
      "copy chat"
      "tray tray";
    grid-template-columns: minmax(0, 0.92fr) minmax(18rem, 1.08fr);
    gap: 1.75rem 2.5rem;
    align-items: start;
    padding-top: 2.5rem;
  }

  .home-chat {
    height: min(26rem, 58svh);
  }

  .home-mark__logo {
    width: min(46vw, 30rem);
  }
}

@media (width < 960px) {
  .home-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .home-actions :deep(.astryx-button) {
    width: 100%;
  }

  .home-ramp__bar {
    height: 3.25rem;
    border-radius: var(--astryx-radius-container);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-motion__chip {
    animation: none;
  }
}
</style>
