<script setup lang="ts">
import type { DocsLocale } from './docs-i18n'
import { usePageData } from 'kawapress/client'
import { computed, ref, useId } from 'vue'

const props = defineProps<{
  codeHtml: string
  description: string
  locale: DocsLocale
  title: string
  /** 演示的原始源码。只从 vue 和 @astryx-vue/core 导入时，才能带进演练场打开。 */
  source?: string
}>()
const activeTab = ref<'description' | 'code'>('description')
const copied = ref(false)
const panelId = useId()
const page = usePageData()
const text = computed(() => props.locale === 'en'
  ? { code: 'Code', copy: 'Copy code', copied: 'Copied', description: 'Description', exampleContent: 'example content', open: 'Open in Playground' }
  : { code: '代码', copy: '复制代码', copied: '已复制', description: '描述', exampleContent: '示例内容', open: '在演练场中打开' })

async function copySource() {
  if (!props.source)
    return
  await navigator.clipboard.writeText(props.source)
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

/** 原版示例标题写成「组件名 — 示例名」。 */
const heading = computed(() => {
  const component = page.value?.frontmatter?.title
  return typeof component === 'string' && component ? `${component} — ${props.title}` : props.title
})

const playgroundReady = computed(() => {
  if (!props.source)
    return false
  const imports = [...props.source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)].map(match => match[1]!)
  return imports.every(source => source === 'vue' || source === '@astryx-vue/core' || source.startsWith('@astryx-vue/core/'))
})

const playgroundBase = computed(() => props.locale === 'en' ? '/en/playground/' : '/playground/')

async function openInPlayground(event: MouseEvent) {
  if (!props.source || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
    return
  event.preventDefault()
  // 演练场的分享链接把代码和主题压进 hash；只在点的时候才加载这部分代码。
  const [{ encodeShare, shareHash }, { createNeutralTheme }] = await Promise.all([
    import('../playground/share'),
    import('../playground/themeState'),
  ])
  const theme = createNeutralTheme()
  theme.dark = document.documentElement.classList.contains('dark')
  const encoded = await encodeShare({ v: 1, templateId: '', code: props.source, theme })
  window.location.href = `${playgroundBase.value}#${shareHash(encoded)}`
}
</script>

<template>
  <section class="component-example">
    <div class="component-example__body">
      <h3 class="component-example__title">
        {{ heading }}
      </h3>
      <div class="component-example__preview">
        <slot />
      </div>
    </div>
    <div class="component-example__bar">
      <div class="component-example__tabs" role="tablist" :aria-label="`${title} ${text.exampleContent}`">
        <button :id="`${panelId}-description`" :aria-controls="panelId" :aria-selected="activeTab === 'description'" role="tab" type="button" @click="activeTab = 'description'">
          <span>{{ text.description }}</span>
        </button>
        <button :id="`${panelId}-code`" :aria-controls="panelId" :aria-selected="activeTab === 'code'" role="tab" type="button" @click="activeTab = 'code'">
          <span>{{ text.code }}</span>
        </button>
      </div>
      <a
        v-if="playgroundReady"
        class="component-example__open"
        :href="playgroundBase"
        @click="openInPlayground"
      >{{ text.open }}</a>
    </div>
    <div :id="panelId" class="component-example__panel" role="tabpanel" :aria-labelledby="`${panelId}-${activeTab}`">
      <p v-if="activeTab === 'description'">
        {{ description }}
      </p>
      <!-- HTML is generated from escaped Vue source by VitePress at build time. -->
      <div v-else class="component-example__code">
        <div class="component-example__code-header">
          <span class="component-example__code-lang">vue</span>
          <button
            v-if="source"
            class="component-example__copy"
            type="button"
            :aria-label="copied ? text.copied : text.copy"
            :title="copied ? text.copied : text.copy"
            @click="copySource"
          >
            <span :class="copied ? 'i-carbon-checkmark' : 'i-carbon-copy'" aria-hidden="true" />
          </button>
        </div>
        <div class="component-example__codeblock" v-html="codeHtml" />
      </div>
    </div>
  </section>
</template>
