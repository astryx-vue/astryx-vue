<script setup lang="ts">
import type { ComponentDocsRoute } from './componentDocsRoute'
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { catalogGroups } from './componentCatalog'
import { componentDocsCopy } from './componentDocsRoute'
import { localePath } from './docs-i18n'

const props = defineProps<{ route: ComponentDocsRoute }>()
const text = computed(() => componentDocsCopy[props.route.locale])
const groups = computed(() => catalogGroups(props.route.locale))
const routePath = useRoute()
const activeGroupId = computed(() => {
  const route = props.route
  if (route.kind !== 'detail')
    return undefined
  return groups.value.find(group => group.entries.some(entry => entry.slug === route.slug))?.id
})
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
      tabindex="-1"
    >
      <SideNav class="component-overview__sidenav" :label="text.navigation">
        <SideNavSection is-header-hidden :title="text.catalogTitle">
          <SideNavItem
            :href="path('/components/')"
            :is-selected="route.kind === 'catalog'"
            :label="text.overview"
            @click="closeSidebar(false)"
          />
          <SideNavItem
            v-for="group in groups"
            :key="activeGroupId === group.id ? `${group.id}-open` : group.id"
            :collapsible="{ defaultIsCollapsed: activeGroupId !== group.id }"
            :label="group.title"
          >
            <SideNavItem
              v-for="entry in group.entries"
              :key="entry.slug"
              :href="path(`/components/${entry.slug}`)"
              :is-selected="route.kind === 'detail' && route.slug === entry.slug"
              :label="entry[route.locale]"
              @click="closeSidebar(false)"
            />
          </SideNavItem>
        </SideNavSection>
      </SideNav>
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
