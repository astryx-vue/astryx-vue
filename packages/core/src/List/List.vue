<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { ListProps, ListSlots } from './types.js'
import { computed, provide, useAttrs, useId, useSlots, useTemplateRef } from 'vue'
import { listContextKey } from './context.js'
import '../../styles/list.css'

defineOptions({ name: 'AstryxList', inheritAttrs: false })

const props = withDefaults(defineProps<ListProps>(), {
  density: 'balanced',
  hasDividers: false,
  listStyle: 'none',
  start: 1,
})

defineSlots<ListSlots>()

const CONTROLLED_ATTRS = new Set(['class', 'style', 'role', 'start'])

const attrs = useAttrs()
const slots = useSlots()
const listElement = useTemplateRef<HTMLUListElement | HTMLOListElement>('list')

const headerId = `astryx-list-header-${useId()}`
const hasHeader = computed(() => slots.header != null || props.header != null)
const tag = computed(() => (props.listStyle === 'decimal' ? 'ol' : 'ul'))
const hasStartAttribute = computed(() => props.listStyle === 'decimal' && props.start !== 1)
const counterStart = computed(() => (hasStartAttribute.value ? `astryx-list ${props.start - 1}` : undefined))

provide(listContextKey, {
  density: computed(() => props.density),
  edgeCompensation: computed(() => props.edgeCompensation),
  hasDividers: computed(() => props.hasDividers),
  listStyle: computed(() => props.listStyle),
})

const listStyleValue = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  counterStart.value == null ? undefined : { counterReset: counterStart.value },
])

const listAttrs = computed<Record<string, unknown>>(() => {
  const forwarded = Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !CONTROLLED_ATTRS.has(key)),
  )

  return {
    ...forwarded,
    'role': 'list',
    'start': hasStartAttribute.value ? props.start : undefined,
    'data-density': props.density,
    'data-dividers': props.hasDividers || undefined,
    'data-edge-compensation': props.edgeCompensation,
    'data-list-style': props.listStyle,
    ...(hasHeader.value ? { 'aria-labelledby': headerId } : undefined),
  }
})

const element = computed(() => listElement.value)

defineExpose({ element })
</script>

<template>
  <div v-if="hasHeader" class="astryx-list-root">
    <div :id="headerId" class="astryx-list-header">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <component
      :is="tag"
      ref="list"
      v-bind="listAttrs"
      class="astryx-list"
      :class="attrs.class"
      :style="listStyleValue"
    >
      <slot />
    </component>
  </div>
  <component
    :is="tag"
    v-else
    ref="list"
    v-bind="listAttrs"
    class="astryx-list"
    :class="attrs.class"
    :style="listStyleValue"
  >
    <slot />
  </component>
</template>
