<script setup lang="ts">
import type { BreadcrumbItemProps } from './types.js'
import { computed, inject } from 'vue'

import { breadcrumbContextKey } from './context.js'

const props = defineProps<BreadcrumbItemProps>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  default: () => unknown
  startIcon: () => unknown
}>()

const context = inject(breadcrumbContextKey, undefined)
const variant = computed(() => context?.variant.value ?? 'default')
const separator = computed(() => context?.separator.value ?? '/')

const classes = computed(() => [
  'astryx-breadcrumb-item',
  `astryx-breadcrumb-item--variant-${variant.value}`,
])

const contentClasses = computed(() => [
  'astryx-breadcrumb-item__content',
  props.isCurrent && 'astryx-breadcrumb-item__content--current',
])

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
    <a
      v-if="href && !isCurrent"
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
