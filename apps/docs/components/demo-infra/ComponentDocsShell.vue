<script setup lang="ts">
import type { ComponentDocsRoute } from './componentDocsRoute'
import { computed } from 'vue'
import { catalogGroups, COMPONENT_CATALOG } from './componentCatalog'
import { componentDocsCopy } from './componentDocsRoute'
import { localePath } from './docs-i18n'

const props = defineProps<{ route: ComponentDocsRoute }>()
const text = computed(() => componentDocsCopy[props.route.locale])
const groups = computed(() => catalogGroups(props.route.locale).map(group => ({
  title: group.title,
  slugs: group.entries.map(entry => entry.slug),
})))
const names = computed<Record<string, string>>(() => Object.fromEntries(
  COMPONENT_CATALOG.map(entry => [entry.slug, entry[props.route.locale]]),
))
function path(value: string): string {
  return localePath(props.route.locale, value)
}
</script>

<template>
  <main class="component-overview" :class="[{ 'component-detail': route.kind === 'detail' }]">
    <aside class="component-overview__sidebar" :aria-label="text.navigation">
      <nav class="component-overview__nav" :aria-label="text.navigation">
        <a :aria-current="route.kind === 'catalog' ? 'page' : undefined" :href="path('/components/')">{{ text.overview }}</a>
        <template v-for="group in groups" :key="group.title">
          <p>{{ group.title }}</p>
          <a v-for="slug in group.slugs" :key="slug" :href="path(`/components/${slug}`)" :aria-current="route.kind === 'detail' && route.slug === slug ? 'page' : undefined">
            {{ names[slug] }}
          </a>
        </template>
      </nav>
    </aside>
    <slot v-if="route.kind === 'catalog'" />
    <article v-else class="component-detail__content">
      <header class="component-detail__header">
        <h1>{{ route.name }}</h1>
      </header>
      <nav class="component-detail__tabs" :aria-label="`${route.name} ${text.documentation}`">
        <a :href="path(`/components/${route.slug}`)" :aria-current="route.tab === 'overview' ? 'page' : undefined">{{ text.overview }}</a>
        <a :href="path(`/components/${route.slug}/props`)" :aria-current="route.tab === 'props' ? 'page' : undefined">{{ text.props }}</a>
      </nav>
      <div class="component-detail__body vp-doc">
        <slot />
      </div>
    </article>
  </main>
</template>
