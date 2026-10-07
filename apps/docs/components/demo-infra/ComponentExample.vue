<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { computed, ref, useId } from 'vue'

const props = defineProps<{
  codeHtml: string
  description: string
  locale: DocsLocale
  title: string
}>()
const activeTab = ref<'description' | 'code'>('description')
const panelId = useId()
const text = computed(() => props.locale === 'en'
  ? { code: 'Code', description: 'Description', exampleContent: 'example content' }
  : { code: '代码', description: '描述', exampleContent: '示例内容' })
</script>

<template>
  <section class="component-example">
    <h3>{{ title }}</h3>
    <div class="component-example__preview">
      <slot />
    </div>
    <div class="component-example__details">
      <div class="component-example__tabs" role="tablist" :aria-label="`${title} ${text.exampleContent}`">
        <button :id="`${panelId}-description`" :aria-controls="panelId" :aria-selected="activeTab === 'description'" role="tab" type="button" @click="activeTab = 'description'">
          {{ text.description }}
        </button>
        <button :id="`${panelId}-code`" :aria-controls="panelId" :aria-selected="activeTab === 'code'" role="tab" type="button" @click="activeTab = 'code'">
          {{ text.code }}
        </button>
      </div>
      <div :id="panelId" class="component-example__panel" role="tabpanel" :aria-labelledby="`${panelId}-${activeTab}`">
        <p v-if="activeTab === 'description'">
          {{ description }}
        </p>
        <!-- HTML is generated from escaped Vue source by VitePress at build time. -->
        <div v-else class="component-example__codeblock" v-html="codeHtml" />
      </div>
    </div>
  </section>
</template>
