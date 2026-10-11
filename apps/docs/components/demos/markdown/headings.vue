<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '# 一级标题\n\n## 二级标题\n\n### 三级标题\n\n#### 四级标题\n\n##### 五级标题\n\n###### 六级标题',
  '# Heading one\n\n## Heading two\n\n### Heading three\n\n#### Heading four\n\n##### Heading five\n\n###### Heading six',
))
</script>

<template>
  <Markdown :content="content" />
</template>
