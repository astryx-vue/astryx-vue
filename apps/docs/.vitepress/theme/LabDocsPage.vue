<script setup lang="ts">
import type { ComponentDocsRoute } from '../../components/demo-infra/componentDocsRoute'
import type { DocsLocale } from '../../components/demo-infra/docs-i18n'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { useData } from 'vitepress'
import { computed } from 'vue'
import ComponentDocsShell from '../../components/demo-infra/ComponentDocsShell.vue'

const { page } = useData()

const route = computed<ComponentDocsRoute>(() => {
  const relative = page.value.relativePath.replace(/\.md$/, '')
  const locale: DocsLocale = relative.startsWith('en/') ? 'en' : 'zh'
  const parts = relative.split('/')
  const labAt = parts.indexOf('lab')
  const slug = parts.slice(labAt + 1).find(part => part !== 'index') ?? null
  return { kind: 'lab', locale, slug }
})

provideAstryxLocale(computed(() => route.value.locale === 'en' ? 'en' : 'zh-CN'))
</script>

<template>
  <ComponentDocsShell :route="route">
    <div class="lab-docs vp-doc">
      <Content />
    </div>
  </ComponentDocsShell>
</template>

<style scoped>
/*
 * 外层已经是组件文档的侧栏布局，这里只补正文留白，
 * 数值跟组件详情页的 content 一致。
 */
.lab-docs {
  box-sizing: border-box;
  width: min(100%, 960px);
  margin-inline: auto;
  padding: 36px 24px 80px;
}
</style>
