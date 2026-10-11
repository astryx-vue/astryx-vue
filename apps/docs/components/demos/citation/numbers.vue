<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <p class="citation-preview">
    {{ pick('滚动行为写在布局说明里', 'Scroll behavior is described in the layout notes') }}
    <Citation
      :number="1"
      variant="number"
      :source="{ title: pick('发布说明', 'Release notes'), url: 'https://example.com/notes' }"
    />
    {{ pick('，未读分隔单独成行', ', and the unread rule is its own row') }}
    <Citation
      :number="2"
      variant="number"
      :source="{ title: pick('变更记录', 'Changelog') }"
    />
    .
  </p>
</template>
