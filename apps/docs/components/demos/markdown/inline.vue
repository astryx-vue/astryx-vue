<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { Text } from '@astryx-vue/core/Text'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const lead = computed(() => pick(
  '用 `value` 配合 **受控状态**，[阅读文档](https://example.com)，不必包一层块。',
  'Use `value` with **controlled state** and [read the docs](https://example.com) without creating block wrappers.',
))
const detail = computed(() => pick(
  '接受动作项 `{label, onClick?, icon?}`、分隔项 `{type: "divider"}`，或分组 `{type: "section", items: [...]}`。',
  'Accepts an action item `{label, onClick?, icon?}`, a divider `{type: "divider"}`, or a section `{type: "section", items: [...]}`.',
))
</script>

<template>
  <div class="markdown-preview__inline">
    <Text display="block" type="large">
      <Markdown display="inline" :content="lead" />
    </Text>
    <div class="markdown-preview__note">
      <Text display="block" type="body" weight="semibold">
        {{ pick('属性说明', 'Prop description') }}
      </Text>
      <Text color="secondary" display="block" type="body">
        <Markdown display="inline" :content="detail" />
      </Text>
    </div>
  </div>
</template>
