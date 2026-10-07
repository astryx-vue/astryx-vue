<script setup lang="ts">
import type { DemoModule } from './defineDemo'
import type { DocsLocale } from './docs-i18n'
import ComponentExample from './ComponentExample.vue'
import VueDemoHost from './VueDemoHost.vue'

defineProps<{
  demo: DemoModule
  description: string
  locale: DocsLocale
  title: string
}>()
</script>

<template>
  <ComponentExample :code-html="demo.sourceHtml" :description="description" :locale="locale" :title="title">
    <VueDemoHost :class-name="demo.className" :component="demo.component" :data-kind="demo.dataKind" />
  </ComponentExample>
</template>
