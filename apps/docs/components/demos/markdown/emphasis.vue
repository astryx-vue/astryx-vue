<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '这一段同时有 **粗体**、*斜体* 和 ~~删除线~~。',
  'This paragraph has **bold**, *italic*, and ~~strikethrough~~.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
