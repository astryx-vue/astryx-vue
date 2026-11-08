<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { computed } from 'vue'
import { componentDemos } from '../demos/registry'
import { catalogGroups } from './componentCatalog'
import { localePath } from './docs-i18n'
import { LAB_COMPONENTS } from './labCatalog'
import LabPreviewFit from './LabPreviewFit.vue'
import VueDemoHost from './VueDemoHost.vue'

const props = defineProps<{ locale: DocsLocale }>()
const labComponents = LAB_COMPONENTS
// 没有 demo 的页面（组合式函数）只在侧栏出现，不占总览卡片。
const groups = computed(() => catalogGroups(props.locale).map(group => ({
  id: group.id,
  title: group.title,
  cards: group.entries.flatMap(entry => componentDemos[entry.slug]
    ? [{ demo: componentDemos[entry.slug], name: entry[props.locale], slug: entry.slug }]
    : []),
})).filter(group => group.cards.length > 0))
</script>

<template>
  <div class="component-overview__content">
    <header class="component-overview__header">
      <h1>{{ locale === 'en' ? 'Browse components' : '浏览组件库' }}</h1>
      <p>{{ locale === 'en' ? 'Find astryx-vue components by purpose and explore their states and variants.' : '按用途查找 astryx-vue 组件，并查看各个状态与变体。' }}</p>
    </header>
    <section v-for="(group, index) in groups" :key="group.id" class="component-overview__catalog" :aria-labelledby="`${locale}-group-${index}`">
      <h2 :id="`${locale}-group-${index}`">
        {{ group.title }}
      </h2>
      <div class="component-overview__grid">
        <article v-for="card in group.cards" :key="card.slug" class="component-card">
          <div aria-hidden="true" class="component-card__frame" inert>
            <div class="component-card__preview">
              <VueDemoHost :class-name="card.demo.className" :component="card.demo.component" :data-kind="card.demo.dataKind" />
            </div>
          </div>
          <a class="component-card__name" :href="localePath(locale, `/components/${card.slug}`)">{{ card.name }}</a>
        </article>
      </div>
    </section>
    <section class="component-overview__catalog component-overview__lab" :aria-labelledby="`${locale}-lab-heading`">
      <div class="component-overview__lab-heading">
        <h2 :id="`${locale}-lab-heading`">
          {{ locale === 'en' ? 'Canary components' : 'Canary 组件' }}
        </h2>
        <a class="component-overview__lab-link" :href="localePath(locale, '/lab/')">
          {{ locale === 'en' ? 'About Lab' : '了解 Lab' }}
        </a>
      </div>
      <p class="component-overview__lab-description">
        {{ locale === 'en' ? 'Experimental components from @astryx-vue/lab. APIs and interactions may change; published only under the canary tag.' : '来自 @astryx-vue/lab 的实验组件。属性和交互可能变化，只通过 canary 标签发布。' }}
      </p>
      <div class="component-overview__grid">
        <article v-for="card in labComponents" :key="card.slug" class="component-card component-card--lab" :data-lab-component="card.slug">
          <div aria-hidden="true" class="component-card__frame" inert>
            <div class="component-card__preview">
              <LabPreviewFit>
                <VueDemoHost :class-name="card.demo.className" :component="card.demo.component" :data-kind="card.demo.dataKind" />
              </LabPreviewFit>
            </div>
          </div>
          <a class="component-card__name" :href="localePath(locale, `/lab/${card.slug}/`)">{{ card.name }}</a>
        </article>
      </div>
    </section>
  </div>
</template>
