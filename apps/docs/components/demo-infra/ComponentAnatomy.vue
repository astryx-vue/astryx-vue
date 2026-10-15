<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { parseComponentDocsRoute } from './componentDocsRoute'
import { anatomyFor } from './reference/loadReference'
import { richText } from './richText'

const { page } = useData()
const route = computed(() => parseComponentDocsRoute(`/${page.value.relativePath.replace(/\.md$/, '')}`))
const locale = computed<DocsLocale>(() => route.value?.locale === 'en' ? 'en' : 'zh')
const parts = computed(() => {
  const current = route.value
  if (current == null || current.kind !== 'detail' || current.tab !== 'overview')
    return null
  return anatomyFor(current.slug, locale.value)
})
const copy = computed(() => locale.value === 'en'
  ? { heading: 'Anatomy', element: 'Element', description: 'Description', label: 'Anatomy' }
  : { heading: '解剖', element: '部分', description: '说明', label: '解剖' })
</script>

<template>
  <section v-if="parts" class="component-anatomy" :aria-label="copy.label">
    <h2>{{ copy.heading }}</h2>
    <div class="component-api-table" role="region" :aria-label="copy.label" tabindex="0">
      <table>
        <thead>
          <tr>
            <th>{{ copy.element }}</th>
            <th>{{ copy.description }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="part in parts" :key="part.name">
            <td>{{ part.name }}</td>
            <td>
              <template v-for="(run, index) in richText(part.description)" :key="index">
                <code v-if="run.code">{{ run.text }}</code>
                <template v-else>
                  {{ run.text }}
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
