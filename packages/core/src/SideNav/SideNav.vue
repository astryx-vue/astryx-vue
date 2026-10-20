<script setup lang="ts">
import type { SideNavCollapsible, SideNavEmits, SideNavHandle, SideNavProps, SideNavSlots } from './types.js'
import { computed, provide, ref, useId, useTemplateRef, watch } from 'vue'
import { useHandleRef } from '../composables/useHandleRef.js'
import { useHotkeys } from '../composables/useHotkeys.js'
import { useAstryxMessages } from '../locale/index.js'
import ResizeHandle from '../Resizable/ResizeHandle.vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { sideNavCollapseKey, useSideNavRenderMode } from './context.js'
import SideNavCollapseButton from './SideNavCollapseButton.vue'
import { useSideNavResize } from './useSideNavResize.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNav' })

const props = withDefaults(defineProps<SideNavProps>(), {
  collapsible: false,
  isCollapsed: undefined,
  resizable: false,
})

const emit = defineEmits<SideNavEmits>()
const slots = defineSlots<SideNavSlots>()
const messages = useAstryxMessages()
const navId = `astryx-side-nav-${useId()}`
const localCollapsed = ref(false)
const bodyEl = useTemplateRef<HTMLElement>('body')
useScrollbars(bodyEl)

const config = computed<SideNavCollapsible>(() =>
  typeof props.collapsible === 'object' ? props.collapsible : {},
)

function controlledCollapsed(): boolean | undefined {
  if (props.isCollapsed !== undefined)
    return props.isCollapsed
  if (typeof props.resizable === 'object') {
    const resizable = props.resizable
    const owns = resizable.defaultIsCollapsed !== undefined
      || resizable.isCollapsed !== undefined
      || resizable.onCollapseChange !== undefined
    if (owns)
      return resizable.isCollapsed
  }
  return config.value.isCollapsed
}

const resize = useSideNavResize({
  collapsible: () => props.collapsible,
  isCollapsed: controlledCollapsed,
  onCollapseChange(next) {
    emit('update:isCollapsed', next)
    emit('collapsedChange', next)
  },
  onWidthChange(width) {
    emit('widthChange', width)
  },
  resizable: () => props.resizable,
})

const isCollapsible = computed(() => Boolean(props.collapsible) || resize.ownsCollapse.value)
const isCollapsed = computed(() => {
  if (!isCollapsible.value)
    return false
  const controlled = controlledCollapsed()
  if (controlled !== undefined)
    return controlled
  if (resize.enabled.value)
    return resize.isCollapsed.value
  return localCollapsed.value
})
const showResizeHandle = computed(() => resize.enabled.value && !isCollapsed.value)
const showButton = computed(() => isCollapsible.value && (config.value.hasButton ?? true))
const hasTop = computed(() => slots.header != null || slots.top != null || showButton.value)
const hasBottom = computed(() => slots.footer != null || slots.footerIcons != null)
const label = computed(() => props.label || messages.value.nav.sideNav)
const renderMode = useSideNavRenderMode()

watch(() => config.value.defaultIsCollapsed, (value) => {
  if (value != null && props.isCollapsed === undefined && config.value.isCollapsed === undefined)
    localCollapsed.value = value
}, { immediate: true })

function setCollapsed(next: boolean): void {
  if (!isCollapsible.value || next === isCollapsed.value)
    return
  if (resize.enabled.value) {
    resize.setCollapsed(next)
    return
  }
  if (props.isCollapsed === undefined && config.value.isCollapsed === undefined)
    localCollapsed.value = next
  emit('update:isCollapsed', next)
  emit('collapsedChange', next)
}

function toggle(): void {
  setCollapsed(!isCollapsed.value)
}

const handle: SideNavHandle = {
  collapse: () => setCollapsed(true),
  expand: () => setCollapsed(false),
  get isCollapsed() {
    return isCollapsed.value
  },
  toggle,
}
useHandleRef(() => props.handleRef, handle)

useHotkeys(computed(() => {
  const keys = config.value.hotkey
  if (!isCollapsible.value || keys == null || keys === '')
    return []
  return [{ keys, onPress: () => toggle() }]
}))

provide(sideNavCollapseKey, {
  isCollapsed,
  isCollapsible,
  navId,
  toggle,
})
</script>

<template>
  <div v-if="renderMode === 'topbar'" class="astryx-side-nav astryx-side-nav--topbar" data-mode="topbar">
    <slot name="header" />
    <div v-if="slots.footerIcons" class="astryx-side-nav__topbar-icons">
      <slot name="footerIcons" />
    </div>
  </div>
  <div v-else-if="renderMode === 'drawer' || renderMode === 'drawer-content'" class="astryx-side-nav astryx-side-nav--drawer" data-mode="drawer">
    <div v-if="slots.top" class="astryx-side-nav__top-content">
      <slot name="top" />
    </div>
    <div ref="body" class="astryx-side-nav__body">
      <slot />
    </div>
    <div v-if="hasBottom" class="astryx-side-nav__bottom">
      <slot name="footer" />
      <div v-if="slots.footerIcons" class="astryx-side-nav__footer-icons">
        <slot name="footerIcons" />
      </div>
    </div>
  </div>
  <div
    v-else
    class="astryx-side-nav-frame"
    :class="{ 'astryx-side-nav-frame--resizable': showResizeHandle }"
  >
    <nav
      :id="navId"
      class="astryx-side-nav"
      :class="{
        'astryx-side-nav--collapsed': isCollapsed,
        'astryx-side-nav--resizing': resize.resizing.value,
      }"
      :style="resize.widthStyle.value"
      :aria-label="label"
      :data-collapsed="isCollapsed || undefined"
    >
      <div v-if="hasTop" class="astryx-side-nav__top">
        <div v-if="slots.header || showButton" class="astryx-side-nav__heading-row">
          <slot name="header" />
          <SideNavCollapseButton v-if="showButton" :label="config.buttonLabel" />
        </div>
        <div v-if="slots.top" class="astryx-side-nav__top-content">
          <slot name="top" />
        </div>
      </div>
      <div ref="body" class="astryx-side-nav__body">
        <slot />
      </div>
      <div v-if="hasBottom" class="astryx-side-nav__bottom">
        <slot name="footer" />
        <div v-if="slots.footerIcons" class="astryx-side-nav__footer-icons">
          <slot name="footerIcons" />
        </div>
      </div>
    </nav>
    <ResizeHandle
      v-if="showResizeHandle"
      data-testid="astryx-sidenav-resize-handle"
      direction="horizontal"
      position="overlay"
      pill-placement="end"
      :is-always-visible="false"
      :resizable="resize.handleProps.value"
      :label="messages.nav.resizeSidebar"
      :aria-controls="navId"
    />
  </div>
</template>
