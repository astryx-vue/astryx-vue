<script setup lang="ts">
import type { ComponentDocsRoute } from './componentDocsRoute'
import { computed } from 'vue'
import { componentDocsCopy } from './componentDocsRoute'
import { localePath } from './docs-i18n'

const props = defineProps<{ route: ComponentDocsRoute }>()
const text = computed(() => componentDocsCopy[props.route.locale])
const groups = computed(() => [
  { title: text.value.action, slugs: ['button', 'button-group', 'icon-button'] },
  { title: text.value.form, slugs: ['text-input', 'text-area', 'checkbox-input', 'checkbox-indicator', 'progress-bar', 'radio', 'radio-group', 'radio-list', 'switch', 'slider', 'field'] },
  { title: text.value.layout, slugs: ['stack', 'divider'] },
  { title: text.value.content, slugs: ['avatar', 'avatar-group', 'blockquote', 'heading', 'text'] },
  { title: text.value.navigation, slugs: ['link', 'breadcrumbs', 'tab-list'] },
  { title: text.value.feedback, slugs: ['banner', 'badge', 'skeleton', 'spinner', 'status-dot'] },
  { title: text.value.overlays, slugs: ['tooltip', 'popover', 'dialog', 'toast'] },
  { title: text.value.utilities, slugs: ['visually-hidden'] },
])
const names = computed(() => ({
  'avatar': text.value.avatar,
  'avatar-group': text.value.avatarGroup,
  'breadcrumbs': text.value.breadcrumbs,
  'button': text.value.button,
  'heading': text.value.heading,
  'link': text.value.link,
  'status-dot': text.value.statusDot,
  'tab-list': text.value.tabList,
  'text': text.value.text,
  'toast': text.value.toast,
  'button-group': text.value.buttonGroup,
  'icon-button': text.value.iconButton,
  'text-input': text.value.textInput,
  'text-area': text.value.textArea,
  'checkbox-input': text.value.checkboxInput,
  'checkbox-indicator': text.value.checkboxIndicator,
  'progress-bar': text.value.progressBar,
  'radio': text.value.radio,
  'radio-group': text.value.radioGroup,
  'radio-list': text.value.radioList,
  'switch': text.value.switch,
  'field': text.value.field,
  'slider': text.value.slider,
  'banner': text.value.banner,
  'stack': text.value.stack,
  'divider': text.value.divider,
  'blockquote': text.value.blockquote,
  'badge': text.value.badge,
  'skeleton': text.value.skeleton,
  'spinner': text.value.spinner,
  'popover': text.value.popover,
  'dialog': text.value.dialog,
  'tooltip': text.value.tooltip,
  'visually-hidden': text.value.visuallyHidden,
}))
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
            {{ names[slug as keyof typeof names] }}
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
