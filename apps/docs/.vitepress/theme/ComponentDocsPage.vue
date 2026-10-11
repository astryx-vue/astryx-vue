<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { parseComponentDocsRoute } from '../../components/demo-infra/componentDocsRoute'
import ComponentDocsShell from '../../components/demo-infra/ComponentDocsShell.vue'

const { page } = useData()
const componentRoute = computed(() => parseComponentDocsRoute(`/${page.value.relativePath.replace(/\.md$/, '')}`))
provideAstryxLocale(computed(() => {
  const routeLocale = componentRoute.value?.locale
  if (routeLocale === 'en' || page.value.relativePath.startsWith('en/'))
    return 'en'
  return 'zh-CN'
}))
</script>

<template>
  <ComponentDocsShell v-if="componentRoute" :route="componentRoute">
    <Content />
  </ComponentDocsShell>
  <Content v-else />
</template>
