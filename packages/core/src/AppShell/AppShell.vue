<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { AppShellBreakpoint, AppShellEmits, AppShellProps, AppShellSlots } from './types.js'
import { computed, provide, reactive, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import { appShellMobileKey } from '../composables/useAppShellMobile.js'
import Layout from '../Layout/Layout.vue'
import LayoutContent from '../Layout/LayoutContent.vue'
import LayoutHeader from '../Layout/LayoutHeader.vue'
import LayoutPanel from '../Layout/LayoutPanel.vue'
import { useAstryxMessages } from '../locale/index.js'
import MobileNav from '../MobileNav/MobileNav.vue'
import MobileNavToggle from '../MobileNav/MobileNavToggle.vue'
import '../../styles/app-shell.css'

defineOptions({
  name: 'AstryxAppShell',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AppShellProps>(), {
  variant: 'elevated',
  height: 'fill',
})

const emit = defineEmits<AppShellEmits>()
defineSlots<AppShellSlots>()

const attrs = useAttrs()
const slots = useSlots()
const messages = useAstryxMessages()
const root = useTemplateRef<HTMLDivElement>('root')
const mainId = 'astryx-app-shell-main'
const mobileNavId = `astryx-app-shell-${useId()}`
const uncontrolledOpen = defineModel<boolean>('mobileNavOpen', { default: false })

defineExpose({ element: root })

const BREAKPOINTS: Record<Exclude<AppShellBreakpoint, 'none'>, number> = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
}

const isBelow = ref(false)

const breakpoint = computed(() => (typeof props.mobileNav === 'object' ? props.mobileNav.breakpoint : undefined) ?? 'md')
const query = computed(() => {
  if (breakpoint.value === 'none')
    return '(width < 0px)'
  return `(width < ${BREAKPOINTS[breakpoint.value]}px)`
})

const open = computed({
  get: () => typeof props.mobileNav === 'object' && props.mobileNav.isOpen != null ? props.mobileNav.isOpen : uncontrolledOpen.value,
  set: (next: boolean) => {
    uncontrolledOpen.value = next
    emit('mobileNavOpenChange', next)
  },
})

const hasTopNav = computed(() => slots.topNav != null)
const hasSideNav = computed(() => slots.sideNav != null)
const hasCustomDrawer = computed(() => slots.mobileNav != null)
const mobileEnabled = computed(() => props.mobileNav !== false && (hasTopNav.value || hasSideNav.value) && !hasCustomDrawer.value)
const hasAutoToggle = computed(() => (typeof props.mobileNav !== 'object' || props.mobileNav.hasToggle !== false) && !hasCustomDrawer.value)
const showSideInline = computed(() => hasSideNav.value && !(isBelow.value && mobileEnabled.value))
const elevate = computed(() => props.variant === 'elevated' && hasTopNav.value && showSideInline.value)
const showMobileBar = computed(() => isBelow.value && mobileEnabled.value && hasAutoToggle.value && hasSideNav.value && !hasTopNav.value)

watch(query, (value, _previous, onCleanup) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return
  const media = window.matchMedia(value)
  const update = () => {
    isBelow.value = media.matches
  }
  update()
  media.addEventListener('change', update)
  onCleanup(() => media.removeEventListener('change', update))
}, { immediate: true })

const mobileState = reactive({
  get isMobile() {
    return isBelow.value
  },
  get isMobileNavOpen() {
    return open.value
  },
  mobileNavId,
  get isMobileNavEnabled() {
    return mobileEnabled.value
  },
  get hasAutoToggle() {
    return hasAutoToggle.value
  },
  get hasSideNav() {
    return hasSideNav.value
  },
  toggleMobileNav: () => {
    if (mobileEnabled.value)
      open.value = !open.value
  },
  openMobileNav: () => {
    if (mobileEnabled.value)
      open.value = true
  },
  closeMobileNav: () => {
    open.value = false
  },
})

provide(appShellMobileKey, mobileState)

const forwardedAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
))
const rootClass = computed(() => ['astryx-app-shell', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)

function focusMain() {
  root.value?.ownerDocument.getElementById(mainId)?.focus()
}
</script>

<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="rootClass"
    :style="rootStyle"
    :data-variant="variant"
    :data-height="height"
  >
    <a class="astryx-app-shell__skip" :href="`#${mainId}`" @click="focusMain">
      {{ messages.layout.skipToContent }}
    </a>
    <Layout :height="height" :padding="0">
      <template v-if="hasTopNav || slots.banner || showMobileBar" #header>
        <div v-if="hasTopNav || slots.banner" class="astryx-app-shell__header" role="banner" :data-variant="variant">
          <LayoutHeader :padding="0" :has-divider="variant === 'section' && hasTopNav">
            <div v-if="slots.banner" class="astryx-app-shell__banner">
              <slot name="banner" />
            </div>
            <slot name="topNav" />
          </LayoutHeader>
        </div>
        <div
          v-if="showMobileBar"
          class="astryx-app-shell__mobile-bar"
          role="banner"
          :data-variant="variant"
        >
          <nav :aria-label="messages.layout.mobileNavigation">
            <MobileNavToggle :is-open="open" :controls="mobileNavId" @update:is-open="open = $event" />
          </nav>
        </div>
      </template>
      <template v-if="showSideInline" #start>
        <LayoutPanel class="astryx-app-shell__sidenav" :padding="0" :has-divider="variant === 'section'" :is-scrollable="height === 'fill'" :data-variant="variant">
          <slot name="sideNav" />
        </LayoutPanel>
      </template>
      <div class="astryx-app-shell__main" :data-elevated="elevate || undefined">
        <div v-if="elevate" class="astryx-app-shell__backdrop" />
        <LayoutContent
          :id="mainId"
          class="astryx-app-shell__content"
          role="main"
          :tabindex="-1"
          :padding="contentPadding ?? 0"
          :is-scrollable="height === 'fill'"
          :data-variant="variant"
          :data-corner="elevate || undefined"
        >
          <slot />
        </LayoutContent>
      </div>
    </Layout>
    <slot v-if="hasCustomDrawer" name="mobileNav" />
    <MobileNav
      v-else-if="isBelow && mobileEnabled"
      :id="mobileNavId"
      v-model:is-open="open"
      :label="messages.layout.mobileNavigation"
    >
      <div :id="`${mobileNavId}-items`" />
      <slot name="sideNav" />
    </MobileNav>
  </div>
</template>
