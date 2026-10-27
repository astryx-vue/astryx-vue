<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { computed } from 'vue'
import {
  PLAYGROUND_LISTED_TEMPLATE_SLUGS,
  PLAYGROUND_TEMPLATE_META,
} from '../playground/templateManifest'
import { localePath } from './docs-i18n'

const props = defineProps<{ locale: DocsLocale }>()

const groups = computed(() => {
  const order: string[] = []
  const byGroup = new Map<string, Array<{ slug: string, name: string, href: string }>>()
  for (const slug of PLAYGROUND_LISTED_TEMPLATE_SLUGS) {
    const meta = PLAYGROUND_TEMPLATE_META[slug]
    const group = props.locale === 'en' ? (meta.groupEn || 'Start') : (meta.categoryZh || '开始')
    const name = props.locale === 'en' ? meta.nameEn : meta.nameZh
    if (!byGroup.has(group)) {
      byGroup.set(group, [])
      order.push(group)
    }
    byGroup.get(group)!.push({
      slug,
      name,
      href: `${localePath(props.locale, '/playground/')}?template=${slug}`,
    })
  }
  return order.map(title => ({ title, items: byGroup.get(title) ?? [] }))
})

const copy = computed(() => props.locale === 'en'
  ? { name: 'Template', open: 'Open' }
  : { name: '模板', open: '打开' })
</script>

<template>
  <div v-for="group in groups" :key="group.title" class="template-index">
    <h2>{{ group.title }}</h2>
    <div class="component-api-table" role="region" :aria-label="group.title" tabindex="0">
      <table>
        <thead>
          <tr>
            <th>{{ copy.name }}</th>
            <th>{{ copy.open }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in group.items" :key="item.slug">
            <td>{{ item.name }}</td>
            <td><a :href="item.href">{{ item.slug }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
