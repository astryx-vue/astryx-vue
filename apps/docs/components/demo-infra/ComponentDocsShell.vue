<script setup lang="ts">
import type { ComponentDocsRoute } from './componentDocsRoute'
import { useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const routePath = useRoute()
const sidebarOpen = ref(false)
const isNarrow = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const sidebarEl = ref<HTMLElement | null>(null)
let media: MediaQueryList | undefined

function path(value: string): string {
  return localePath(props.route.locale, value)
}

function syncNarrow(): void {
  isNarrow.value = media?.matches ?? false
  if (!isNarrow.value)
    sidebarOpen.value = false
}

function openSidebar(): void {
  sidebarOpen.value = true
  nextTick(() => sidebarEl.value?.focus())
}

function closeSidebar(restoreFocus = true): void {
  if (!sidebarOpen.value)
    return
  sidebarOpen.value = false
  if (restoreFocus)
    nextTick(() => menuButton.value?.focus())
}

function toggleSidebar(): void {
  if (sidebarOpen.value)
    closeSidebar()
  else
    openSidebar()
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    closeSidebar()
}

onMounted(() => {
  media = window.matchMedia('(width < 60rem)')
  syncNarrow()
  media.addEventListener('change', syncNarrow)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  media?.removeEventListener('change', syncNarrow)
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})

watch(sidebarOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

watch(() => routePath.path, () => {
  closeSidebar(false)
})
</script>

<template>
  <main class="component-overview" :class="[{ 'component-detail': route.kind === 'detail', 'is-sidebar-open': sidebarOpen }]">
    <div class="component-overview__toolbar">
      <button
        ref="menuButton"
        type="button"
        class="component-overview__menu"
        :aria-expanded="sidebarOpen"
        aria-controls="component-overview-nav"
        @click="toggleSidebar"
      >
        <svg class="component-overview__menu-icon" width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
          <path d="M0 1h16M0 7h12M0 13h8" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
        {{ text.menu }}
      </button>
      <button type="button" class="component-overview__totop" @click="scrollToTop">
        {{ text.returnToTop }}
      </button>
    </div>
    <button
      v-if="sidebarOpen"
      type="button"
      class="component-overview__backdrop"
      tabindex="-1"
      :aria-label="text.closeNavigation"
      @click="closeSidebar()"
    />
    <aside
      id="component-overview-nav"
      ref="sidebarEl"
      class="component-overview__sidebar"
      :class="{ 'is-open': sidebarOpen }"
      :aria-label="text.navigation"
      tabindex="-1"
    >
      <nav class="component-overview__nav" :aria-label="text.navigation">
        <a :aria-current="route.kind === 'catalog' ? 'page' : undefined" :href="path('/components/')" @click="closeSidebar(false)">{{ text.overview }}</a>
        <template v-for="group in groups" :key="group.title">
          <p class="component-overview__group">
            {{ group.title }}
          </p>
          <a v-for="slug in group.slugs" :key="slug" :href="path(`/components/${slug}`)" :aria-current="route.kind === 'detail' && route.slug === slug ? 'page' : undefined" @click="closeSidebar(false)">
            {{ names[slug] }}
          </a>
        </template>
      </nav>
    </aside>
    <div class="component-overview__main" :inert="sidebarOpen ? true : undefined">
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
    </div>
  </main>
</template>
