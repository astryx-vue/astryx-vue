<script setup lang="ts">
import type { SchedulePopover } from './useSchedulePopover.js'
import { Button } from '@astryx-vue/core'
import { computed } from 'vue'

defineOptions({ name: 'AstryxSchedulePopover' })

const props = defineProps<{ popover: SchedulePopover }>()

const isOpen = computed(() => props.popover.isOpen.value)
const surfaceProps = computed(() => props.popover.surfaceProps.value)
const surfaceStyle = computed(() => ({
  ...props.popover.contentStyle.value,
  '--_popover-padding': 'var(--astryx-spacing-3)',
  'maxWidth': 'min(360px, var(--astryx-layer-max-inline-size, calc(100vw - 32px)))',
}))

function setContent(element: unknown): void {
  props.popover.bindContent(element)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      :ref="setContent"
      class="astryx-popover"
      data-placement="below"
      :style="surfaceStyle"
      v-bind="surfaceProps"
    >
      <div class="astryx-popover__body">
        <slot />
      </div>
      <div class="astryx-popover__close">
        <Button variant="secondary" label="Close" @click="popover.hide()" />
      </div>
    </div>
  </Teleport>
</template>
