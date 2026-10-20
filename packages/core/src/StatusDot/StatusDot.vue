<script setup lang="ts">
import type { StatusDotProps } from './types.js'
import { computed, defineComponent } from 'vue'
import Tooltip from '../Tooltip/Tooltip.vue'

import '../../styles/status-dot.css'

defineOptions({ name: 'AstryxStatusDot' })

const props = withDefaults(defineProps<StatusDotProps>(), {
  variant: 'neutral',
  isPulsing: false,
})

defineSlots<{
  /** Optional icon rendered centered inside the dot. */
  icon?: () => unknown
}>()

/** Renders the child as-is, so the dot keeps its own root element. */
const Passthrough = defineComponent({
  setup(_props, { slots }) {
    return () => slots.default?.()
  },
})

const wrapper = computed(() => (props.tooltip ? Tooltip : Passthrough))
const wrapperProps = computed(() => (props.tooltip ? { content: props.tooltip } : {}))
</script>

<template>
  <component
    :is="wrapper"
    v-bind="wrapperProps"
  >
    <span
      class="astryx-status-dot"
      :class="{ 'astryx-status-dot--pulsing': isPulsing }"
      :data-variant="variant"
      role="img"
      :aria-label="label"
    >
      <span
        v-if="$slots.icon"
        class="astryx-status-dot__icon"
        aria-hidden="true"
      >
        <slot name="icon" />
      </span>
    </span>
  </component>
</template>
