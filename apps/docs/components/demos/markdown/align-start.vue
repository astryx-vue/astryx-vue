<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '# 内容对齐\n\n这段受 `contentWidth` 限制，比下面的代码块和表格窄。\n\n- 第一项会换行，用来看出行宽\n- 第二项同样受行宽约束\n\n```ts\nexport const ready = true\n```\n\n代码块铺满外框，正文按对齐方式摆放。\n\n| 组件 | 状态 |\n| --- | --- |\n| Button | 稳定 |\n| Markdown | 进行中 |',
  '# Content alignment\n\nThis paragraph is constrained by `contentWidth`. It is narrower than the code block and the table.\n\n- First item wraps so the measure is visible\n- Second item stays inside the same measure\n\n```ts\nexport const ready = true\n```\n\nThe code block fills the frame, while the prose follows the alignment.\n\n| Component | Status |\n| --- | --- |\n| Button | Stable |\n| Markdown | In progress |',
))
</script>

<template>
  <div class="markdown-preview__frame">
    <Markdown :content="content" content-align="start" :content-width="580" />
  </div>
</template>
