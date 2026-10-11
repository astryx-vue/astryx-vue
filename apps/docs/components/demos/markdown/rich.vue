<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  [
    '## 一周小结',
    '',
    '正文支持 **粗体**、*斜体* 和 ~~删除线~~。邮箱 ada@example.com 会变成链接。',
    '',
    '> 引用块沿用 Blockquote 的样式。',
    '',
    '- [x] 表格、任务列表和自动链接',
    '- [ ] 原始 HTML 不会执行',
    '',
    '| 项目 | 状态 |',
    '| --- | ---: |',
    '| 解析 | 完成 |',
    '| 公式 | 暂不支持 |',
    '',
    '```ts',
    'export const ready = true',
    '```',
    '',
    '---',
    '',
    '分隔线下面是最后一段。',
  ].join('\n'),
  [
    '## Weekly note',
    '',
    'Prose can use **bold**, *italic*, and ~~strikethrough~~. The address ada@example.com becomes a link.',
    '',
    '> A quote uses the Blockquote styles.',
    '',
    '- [x] Tables, task lists, and autolinks',
    '- [ ] Raw HTML is not executed',
    '',
    '| Item | Status |',
    '| --- | ---: |',
    '| Parser | Done |',
    '| Math | Not in this version |',
    '',
    '```ts',
    'export const ready = true',
    '```',
    '',
    '---',
    '',
    'The last paragraph sits under the rule.',
  ].join('\n'),
))
</script>

<template>
  <Markdown :content="content" />
</template>
