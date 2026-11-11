<script setup lang="ts">
import type { VNode } from 'vue'
import type { EmptyStateProps, EmptyStateSlots } from './types.js'
import { Comment, computed, Fragment, Text as TextVNode, useSlots, useTemplateRef } from 'vue'
import Heading from '../Heading/Heading.vue'
import Text from '../Text/Text.vue'
import '../../styles/empty-state.css'

defineOptions({ name: 'AstryxEmptyState' })

const props = withDefaults(defineProps<EmptyStateProps>(), {
  headingLevel: 3,
  isCompact: false,
})

defineSlots<EmptyStateSlots>()
const slots = useSlots()

function hasRenderableContent(nodes: VNode[] | undefined): boolean {
  return (nodes ?? []).some((node) => {
    if (node.type === Comment)
      return false
    if (node.type === TextVNode)
      return typeof node.children === 'string' && node.children.length > 0
    if (node.type === Fragment)
      return Array.isArray(node.children) && hasRenderableContent(node.children as VNode[])
    // Elements and components are intentional content even when their own
    // children are empty; only shallow-empty scalar slots are omitted.
    return true
  })
}

function hasSlotContent(name: 'icon' | 'description' | 'actions'): boolean {
  return hasRenderableContent(slots[name]?.() as VNode[] | undefined)
}

function hasDescription(): boolean {
  return (props.description != null && props.description !== '') || hasSlotContent('description')
}

const root = useTemplateRef<HTMLDivElement>('root')
const element = computed(() => root.value ?? null)

defineExpose({ element })

const variant = computed(() => (props.isCompact ? 'compact' : undefined))
</script>

<template>
  <div
    ref="root"
    class="astryx-empty-state"
    role="status"
    :data-variant="variant"
  >
    <div
      v-if="hasSlotContent('icon')"
      class="astryx-empty-state-icon"
      aria-hidden="true"
    >
      <slot name="icon" />
    </div>

    <div class="astryx-empty-state-text">
      <Heading
        :level="headingLevel"
        class="astryx-empty-state-title"
        type="large"
        weight="semibold"
        :data-variant="variant"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </Heading>

      <Text
        v-if="hasDescription()"
        as="div"
        class="astryx-empty-state-description"
        type="body"
        color="secondary"
        weight="regular"
        :data-variant="variant"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </Text>
    </div>

    <div v-if="hasSlotContent('actions')" class="astryx-empty-state-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
