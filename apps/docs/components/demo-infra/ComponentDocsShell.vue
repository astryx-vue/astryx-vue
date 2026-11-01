<script setup lang="ts">
import type { ComponentDocsRoute } from './componentDocsRoute'
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { componentDemos } from '../demos/registry'
import { sidebarItems } from './componentCatalog'
import { LAB_COMPONENTS } from './labNav'
import { UPSTREAM_PACKAGE, UPSTREAM_VERSION } from './componentDocsRoute'
import { componentDocsCopy, localePath } from './docs-i18n'
import PropsPlayground from './PropsPlayground.vue'
import { hasAccessibility } from './reference/loadReference'
import StageFit from './StageFit.vue'
import VueDemoHost from './VueDemoHost.vue'

const props = defineProps<{ route: ComponentDocsRoute }>()
const text = computed(() => componentDocsCopy[props.route.locale])
const showAccessibility = computed(() => props.route.kind === 'detail' && hasAccessibility(props.route.slug))
// 顶部演示用的是总览卡片那份 demo：它展示的是组件最基础的形态。
const stageDemo = computed(() => (props.route.kind === 'detail' ? componentDemos[props.route.slug] : undefined))
const sidebar = computed(() => sidebarItems(props.route.locale))
const routePath = useRoute()
// 当前页所在的家族默认展开，其余收起。
const activeFamilyId = computed(() => {
  const route = props.route
  if (route.kind !== 'detail')
    return undefined
  for (const item of sidebar.value) {
    if (item.kind === 'family' && item.entries.some(entry => entry.slug === route.slug))
      return item.id
  }
  return undefined
})
/** 上游没有同名导出、标题下不显示版本行的页面（Chat 是一组组件的概览）。 */
const NO_EXPORT_SLUGS: ReadonlySet<string> = new Set(['chat'])

/** 导出名不是 slug 驼峰形式的少数组件。 */
const EXPORT_NAME_EXCEPTIONS: Readonly<Record<string, string>> = {
  'dropdown-menu-submenu': 'DropdownMenuSubMenu',
}

/** 页面标题下那行小字里的导出名：`base-typeahead` → `BaseTypeahead`，`use-clipboard` → `useClipboard`。 */
const exportName = computed(() => {
  if (props.route.kind !== 'detail')
    return ''
  if (NO_EXPORT_SLUGS.has(props.route.slug))
    return ''
  const special = EXPORT_NAME_EXCEPTIONS[props.route.slug]
  if (special)
    return special
  const parts = props.route.slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1))
  const pascal = parts.join('')
  return props.route.slug.startsWith('use-') ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : pascal
})
const packageName = computed(() => {
  if (props.route.kind === 'detail' && props.route.slug === 'rich-text-editor')
    return '@astryxdesign/richtext'
  if (props.route.kind === 'detail' && props.route.slug === 'chart')
    return '@astryxdesign/charts'
  return UPSTREAM_PACKAGE
})
const packageVersion = computed(() => props.route.kind === 'detail' && props.route.slug === 'chart' ? '0.1.9' : UPSTREAM_VERSION)
const sidebarOpen = ref(false)
const isNarrow = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const backdropEl = ref<HTMLButtonElement | null>(null)
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
  nextTick(() => sidebarEl.value?.focus({ preventScroll: true }))
}

function closeSidebar(restoreFocus = true): void {
  if (!sidebarOpen.value)
    return
  sidebarOpen.value = false
  if (restoreFocus)
    nextTick(() => menuButton.value?.focus({ preventScroll: true }))
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

function revealSelection(): void {
  nextTick(() => {
    const scroller = sidebarEl.value?.querySelector<HTMLElement>('.astryx-side-nav__body')
    const current = scroller?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!scroller || !current)
      return
    const itemTop = current.getBoundingClientRect().top
    const boxTop = scroller.getBoundingClientRect().top
    const boxBottom = scroller.getBoundingClientRect().bottom
    if (itemTop < boxTop || itemTop > boxBottom)
      scroller.scrollTop += itemTop - boxTop - 48
  })
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    closeSidebar()
}

function onFocusIn(event: FocusEvent): void {
  if (!sidebarOpen.value || !isNarrow.value)
    return
  const sidebar = sidebarEl.value
  const target = event.target
  if (!sidebar || !(target instanceof Node) || sidebar.contains(target) || target === backdropEl.value)
    return
  sidebar.focus({ preventScroll: true })
}

onMounted(() => {
  media = window.matchMedia('(width < 60rem)')
  syncNarrow()
  media.addEventListener('change', syncNarrow)
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('focusin', onFocusIn)
  revealSelection()
})

onBeforeUnmount(() => {
  media?.removeEventListener('change', syncNarrow)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('focusin', onFocusIn)
  document.documentElement.classList.remove('component-docs-scroll-lock')
})

watch(sidebarOpen, (open) => {
  document.documentElement.classList.toggle('component-docs-scroll-lock', open)
})

watch(() => routePath.path, () => {
  closeSidebar(false)
  revealSelection()
})
</script>

<template>
  <main class="component-overview" :class="[{ 'component-detail': route.kind === 'detail', 'component-detail--props': route.kind === 'detail' && route.tab === 'props', 'is-sidebar-open': sidebarOpen }]">
    <div class="component-overview__toolbar" :inert="sidebarOpen ? true : undefined">
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
    <Teleport to="body" :disabled="!isNarrow">
      <button
        ref="backdropEl"
        type="button"
        class="component-overview__backdrop"
        :class="{ 'is-open': sidebarOpen }"
        tabindex="-1"
        :aria-hidden="sidebarOpen ? undefined : true"
        :aria-label="text.closeNavigation"
        @click="closeSidebar()"
      />
      <aside
        id="component-overview-nav"
        ref="sidebarEl"
        class="component-overview__sidebar"
        :class="{ 'is-open': sidebarOpen }"
        :inert="isNarrow && !sidebarOpen ? true : undefined"
        :aria-modal="isNarrow && sidebarOpen ? true : undefined"
        :role="isNarrow && sidebarOpen ? 'dialog' : undefined"
        :aria-label="isNarrow && sidebarOpen ? text.navigation : undefined"
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
            <template v-for="item in sidebar" :key="item.kind === 'family' ? item.id : item.entry.slug">
              <SideNavItem
                v-if="item.kind === 'family'"
                :key="activeFamilyId === item.id ? `${item.id}-open` : item.id"
                :collapsible="{ defaultIsCollapsed: activeFamilyId !== item.id }"
                :label="item.title"
              >
                <SideNavItem
                  v-for="entry in item.entries"
                  :key="entry.slug"
                  :href="path(`/components/${entry.slug}`)"
                  :is-selected="route.kind === 'detail' && route.slug === entry.slug"
                  :label="entry[route.locale]"
                  @click="closeSidebar(false)"
                />
              </SideNavItem>
              <SideNavItem
                v-else
                :href="path(`/components/${item.entry.slug}`)"
                :is-selected="route.kind === 'detail' && route.slug === item.entry.slug"
                :label="item.entry[route.locale]"
                @click="closeSidebar(false)"
              />
            </template>
            <SideNavItem
              :key="route.kind === 'lab' ? 'lab-open' : 'lab'"
              :collapsible="{ defaultIsCollapsed: route.kind !== 'lab' }"
              label="Lab"
            >
              <SideNavItem
                :href="path('/lab/')"
                :is-selected="route.kind === 'lab' && route.slug == null"
                :label="route.locale === 'en' ? 'Overview' : '概览'"
                @click="closeSidebar(false)"
              />
              <SideNavItem
                v-for="entry in LAB_COMPONENTS"
                :key="entry.slug"
                :href="path(`/lab/${entry.slug}`)"
                :is-selected="route.kind === 'lab' && route.slug === entry.slug"
                :label="entry[route.locale]"
                @click="closeSidebar(false)"
              />
            </SideNavItem>
          </SideNavSection>
        </SideNav>
      </aside>
    </Teleport>
    <div class="component-overview__main" :inert="sidebarOpen ? true : undefined">
      <slot v-if="route.kind === 'catalog' || route.kind === 'lab'" />
      <article v-else-if="route.kind === 'detail'" class="component-detail__content">
        <header class="component-detail__header">
          <h1>{{ route.name }}</h1>
          <p v-if="exportName" class="component-detail__version">
            {{ text.alignmentTarget }}：{{ packageName }} v{{ packageVersion }} · {{ exportName }}
          </p>
        </header>
        <nav class="component-detail__tabs" :aria-label="`${route.name} ${text.documentation}`">
          <a :href="path(`/components/${route.slug}`)" :aria-current="route.tab === 'overview' ? 'page' : undefined">{{ text.overview }}</a>
          <a :href="path(`/components/${route.slug}/props`)" :aria-current="route.tab === 'props' ? 'page' : undefined">{{ text.props }}</a>
          <a v-if="showAccessibility" :href="path(`/components/${route.slug}/accessibility`)" :aria-current="route.tab === 'accessibility' ? 'page' : undefined">{{ text.accessibility }}</a>
        </nav>
        <div v-if="route.tab === 'overview' && stageDemo" class="component-detail__stage">
          <StageFit :min-scale="route.slug === 'rich-text-editor' ? 1 : 0.5">
            <VueDemoHost
              :class-name="stageDemo.className"
              :component="stageDemo.component"
              :data-kind="stageDemo.dataKind"
            />
          </StageFit>
        </div>
        <div class="component-detail__body vp-doc">
          <PropsPlayground v-if="route.tab === 'props'" :locale="route.locale" :slug="route.slug" />
          <slot />
        </div>
      </article>
    </div>
  </main>
</template>
