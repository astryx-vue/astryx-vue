<script setup lang="ts">
import type { EmptyStateProps, EmptyStateSlots } from './types.js'
import { computed, useTemplateRef } from 'vue'
import Heading from '../Heading/Heading.vue'
import Text from '../Text/Text.vue'
import '../../styles/empty-state.css'

defineOptions({ name: 'AstryxEmptyState' })

const props = withDefaults(defineProps<EmptyStateProps>(), {
  headingLevel: 3,
  isCompact: false,
})

defineSlots<EmptyStateSlots>()

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
      v-if="$slots.icon"
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
        v-if="description != null || $slots.description"
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

    <div v-if="$slots.actions" class="astryx-empty-state-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
