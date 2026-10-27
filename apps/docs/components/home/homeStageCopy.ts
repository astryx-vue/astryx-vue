/** 首页主舞台的中英文文案，包括自动播放聊天的脚本。 */
export type HomeStageLocale = 'zh' | 'en'

export const HOME_STAGE_COPY = {
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
</script>

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
</script>

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

export type HomeStageCopy = (typeof HOME_STAGE_COPY)[HomeStageLocale]
