<script setup lang="ts">
import type { StatusDotProps } from './types.js'
import { computed, defineComponent, toRaw, useSlots } from 'vue'
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

const slots = useSlots()
const icon = computed(() => props.icon ? toRaw(props.icon) : undefined)
const showsIcon = computed(() => Boolean(slots.icon) || icon.value != null)
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
        v-if="showsIcon"
        class="astryx-status-dot__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          <component :is="icon" v-if="icon" />
        </slot>
      </span>
    </span>
  </component>
</template>
