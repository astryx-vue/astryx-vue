<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { computed } from 'vue'
import { componentDemos } from '../demos/registry'
import { catalogGroups } from './componentCatalog'
import { localePath } from './docs-i18n'
import VueDemoHost from './VueDemoHost.vue'

const props = defineProps<{ locale: DocsLocale }>()
const groups = computed(() => catalogGroups(props.locale).map(group => ({
  title: group.title,
  cards: group.entries.map(entry => ({
    demo: componentDemos[entry.slug],
    name: entry[props.locale],
    slug: entry.slug,
  })),
})))
</script>

<template>
  <div class="component-overview__content">
    <header class="component-overview__header">
      <h1>{{ locale === 'en' ? 'Browse components' : '浏览组件库' }}</h1>
      <p>{{ locale === 'en' ? 'Find astryx-vue components by purpose and explore their states and variants.' : '按用途查找 astryx-vue 组件，并查看各个状态与变体。' }}</p>
    </header>
    <section v-for="(group, index) in groups" :key="group.title" class="component-overview__catalog" :aria-labelledby="`${locale}-group-${index}`">
      <h2 :id="`${locale}-group-${index}`">
        {{ group.title }}
      </h2>
      <div class="component-overview__grid">
        <article v-for="card in group.cards" :key="card.slug" class="component-card">
          <div aria-hidden="true" class="component-card__preview" inert>
            <VueDemoHost :class-name="card.demo.className" :component="card.demo.component" :data-kind="card.demo.dataKind" />
          </div>
          <a class="component-card__name" :href="localePath(locale, `/components/${card.slug}`)">{{ card.name }}</a>
        </article>
      </div>
    </section>
  </div>
</template>
