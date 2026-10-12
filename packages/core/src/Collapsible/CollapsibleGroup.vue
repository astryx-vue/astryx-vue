<script setup lang="ts">
import type { CollapsibleGroupValue } from './context.js'
import type { CollapsibleGroupEmits, CollapsibleGroupProps, CollapsibleGroupSlots } from './groupTypes.js'
import { computed, provide, shallowRef } from 'vue'
import { collapsibleGroupKey, collapsibleGroupPresentationKey } from './context.js'
import '../../styles/collapsible.css'

defineOptions({ name: 'AstryxCollapsibleGroup' })

const props = withDefaults(defineProps<CollapsibleGroupProps>(), {
  hasDividers: false,
  type: 'single',
})

const emit = defineEmits<CollapsibleGroupEmits>()
defineSlots<CollapsibleGroupSlots>()

function initialValue(): CollapsibleGroupValue {
  if (props.defaultValue != null)
    return props.defaultValue
  return props.type === 'multiple' ? [] : ''
}

const value = defineModel<CollapsibleGroupValue>('value')
const localValue = shallowRef<CollapsibleGroupValue>(initialValue())

const current = computed(() => value.value ?? localValue.value)

function asList(next: CollapsibleGroupValue): string[] {
  return Array.isArray(next) ? next : next === '' ? [] : [next]
}

const openValues = computed(() => asList(current.value))

function commit(next: string[]): void {
  const emitted: CollapsibleGroupValue = props.type === 'single' ? (next[0] ?? '') : next
  localValue.value = emitted
  value.value = emitted
  emit('change', emitted)
}

function isOpen(item: string): boolean {
  return openValues.value.includes(item)
}

function toggle(item: string): void {
  const open = openValues.value
  const next = props.type === 'single'
    ? (open.includes(item) ? [] : [item])
    : (open.includes(item) ? open.filter(entry => entry !== item) : [...open, item])
  commit(next)
}

const density = computed(() => props.density ?? (props.hasDividers ? 'balanced' : null))
const hasDividers = computed(() => props.hasDividers)

provide(collapsibleGroupKey, { isOpen, toggle })
provide(collapsibleGroupPresentationKey, { density, hasDividers })
</script>

<template>
  <div
    v-if="hasDividers"
    class="astryx-collapsible-group"
    :data-density="density || undefined"
  >
    <slot />
  </div>
  <slot v-else />
</template>
