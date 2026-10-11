<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '# 这一级会落到 h3\n\n## 再深一级是 h4\n\n### 最深到 h6 为止',
  '# This level renders as h3\n\n## The next level is h4\n\n### Deeper levels stop at h6',
))
</script>

<template>
  <Markdown :content="content" :heading-level-start="3" />
</template>
