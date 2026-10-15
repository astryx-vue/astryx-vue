<script setup lang="ts">
import type { DropdownMenuSize } from '../DropdownMenu/types.js'
import type { BreadcrumbItemProps } from './types.js'
import { computed, inject } from 'vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import Icon from '../Icon/Icon.vue'
import { breadcrumbContextKey } from './context.js'

const props = defineProps<BreadcrumbItemProps>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const slots = defineSlots<{
  default: () => unknown
  startIcon: () => unknown
  /** Compound menu rows. Used instead of the `menu` array. */
  menu?: () => unknown
}>()

const context = inject(breadcrumbContextKey, undefined)
const variant = computed(() => context?.variant.value ?? 'default')
const separator = computed(() => context?.separator.value ?? '/')
const hasMenu = computed(() => props.menu != null || slots.menu != null)

const classes = computed(() => [
  'astryx-breadcrumb-item',
  `astryx-breadcrumb-item--variant-${variant.value}`,
])

const contentClasses = computed(() => [
  'astryx-breadcrumb-item__content',
  props.isCurrent && 'astryx-breadcrumb-item__content--current',
])

const menuSize = computed<DropdownMenuSize>(() => props.menuSize ?? (variant.value === 'supporting' ? 'sm' : 'md'))

const isDev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV !== false
if (isDev && hasMenu.value && props.href) {
  console.warn(
    'BreadcrumbItem: `menu` and `href` are mutually exclusive; `menu` takes precedence and `href` is ignored.',
  )
}

function handleClick(event: MouseEvent) {
  if (props.isCurrent) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <li :class="classes">
    <span class="astryx-breadcrumb-item__separator" aria-hidden="true">{{ separator }}</span>
    <DropdownMenu
      v-if="hasMenu"
      :button="{ label: 'Menu', size: menuSize }"
      :items="slots.menu ? undefined : menu"
      menu-width="max-content"
    >
      <template v-if="slots.menu" #default>
        <slot name="menu" />
      </template>
      <template #trigger="triggerProps">
        <button
          type="button"
          :class="contentClasses"
          v-bind="triggerProps"
          :aria-current="isCurrent ? 'page' : undefined"
        >
          <span v-if="$slots.startIcon" class="astryx-breadcrumb-item__icon">
            <slot name="startIcon" />
          </span>
          <slot />
          <Icon class="astryx-breadcrumb-item__chevron" icon="chevronDown" size="sm" />
        </button>
      </template>
    </DropdownMenu>
    <a
      v-else-if="href && !isCurrent"
      :href="href"
      class="astryx-breadcrumb-item__content"
      @click="handleClick"
    >
      <span v-if="$slots.startIcon" class="astryx-breadcrumb-item__icon">
        <slot name="startIcon" />
      </span>
      <slot />
    </a>
    <button
      v-else-if="!isCurrent"
      type="button"
      class="astryx-breadcrumb-item__content"
      @click="handleClick"
    >
      <span v-if="$slots.startIcon" class="astryx-breadcrumb-item__icon">
        <slot name="startIcon" />
      </span>
      <slot />
    </button>
    <span
      v-else
      :class="contentClasses"
      aria-current="page"
    >
      <span v-if="$slots.startIcon" class="astryx-breadcrumb-item__icon">
        <slot name="startIcon" />
      </span>
      <slot />
    </span>
  </li>
</template>
