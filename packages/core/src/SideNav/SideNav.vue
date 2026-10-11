<script setup lang="ts">
import type { SideNavCollapsible, SideNavEmits, SideNavProps, SideNavSlots } from './types.js'
import { computed, provide, ref, useId, watch } from 'vue'
import { useHotkeys } from '../composables/useHotkeys.js'
import { useAstryxMessages } from '../locale/index.js'
import { sideNavCollapseKey } from './context.js'
import SideNavCollapseButton from './SideNavCollapseButton.vue'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNav' })

const props = withDefaults(defineProps<SideNavProps>(), {
  collapsible: false,
  isCollapsed: undefined,
})

const emit = defineEmits<SideNavEmits>()
const slots = defineSlots<SideNavSlots>()
const messages = useAstryxMessages()
const navId = `astryx-side-nav-${useId()}`
const localCollapsed = ref(false)

const config = computed<SideNavCollapsible>(() =>
  typeof props.collapsible === 'object' ? props.collapsible : {},
)
const isCollapsible = computed(() => Boolean(props.collapsible))
const isCollapsed = computed(() => {
  if (!isCollapsible.value)
    return false
  if (props.isCollapsed !== undefined)
    return props.isCollapsed
  if (config.value.isCollapsed !== undefined)
    return config.value.isCollapsed
  return localCollapsed.value
})
const showButton = computed(() => isCollapsible.value && (config.value.hasButton ?? true))
const hasTop = computed(() => slots.header != null || slots.top != null || showButton.value)
const hasBottom = computed(() => slots.footer != null || slots.footerIcons != null)
const label = computed(() => props.label || messages.value.nav.sideNav)

watch(() => config.value.defaultIsCollapsed, (value) => {
  if (value != null && props.isCollapsed === undefined && config.value.isCollapsed === undefined)
    localCollapsed.value = value
}, { immediate: true })

function setCollapsed(next: boolean): void {
  if (!isCollapsible.value || next === isCollapsed.value)
    return
  if (props.isCollapsed === undefined && config.value.isCollapsed === undefined)
    localCollapsed.value = next
  emit('update:isCollapsed', next)
  emit('collapsedChange', next)
}

function toggle(): void {
  setCollapsed(!isCollapsed.value)
}

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
  <nav
    :id="navId"
    class="astryx-side-nav"
    :class="{ 'astryx-side-nav--collapsed': isCollapsed }"
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
    <div class="astryx-side-nav__body">
      <slot />
    </div>
    <div v-if="hasBottom" class="astryx-side-nav__bottom">
      <slot name="footer" />
      <div v-if="slots.footerIcons" class="astryx-side-nav__footer-icons">
        <slot name="footerIcons" />
      </div>
    </div>
  </nav>
</template>
