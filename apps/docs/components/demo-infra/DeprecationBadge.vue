<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { Badge } from '@astryx-vue/core/Badge'
import { componentDocsCopy } from './docs-i18n'

/** 废弃组件名字旁边的标记。用中性色：它是名字的附注，不是警告；警告由文档页顶部的提示来说。 */
defineProps<{ locale: DocsLocale }>()
</script>

<template>
  <Badge class="docs-deprecation-badge" variant="neutral" :label="componentDocsCopy[locale].deprecated" />
</template>
