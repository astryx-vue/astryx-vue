<script setup lang="ts">
import { useTooltip } from '@astryx-vue/core/Tooltip'

const tooltip = useTooltip({ placement: 'above', delay: 120 })
const { isOpen, contentStyle, contentProps } = tooltip
</script>

<template>
  <div class="hook-tooltip">
    <button :ref="tooltip.triggerRef" type="button" class="hook-tooltip__trigger">
      Hover or focus me
    </button>

    <Teleport to="body">
      <div
        v-show="isOpen"
        :ref="tooltip.contentRef"
        v-bind="contentProps"
        class="hook-tooltip__bubble"
        :style="contentStyle"
      >
        Tooltip content from useTooltip
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hook-tooltip {
  display: flex;
  justify-content: center;
}

.hook-tooltip__trigger {
  padding: 8px 16px;
  border: 1px dashed var(--astryx-color-border, #d4d4d4);
  border-radius: var(--astryx-radius-control, 8px);
  background: var(--astryx-color-background-surface, #fff);
  color: var(--astryx-color-text-primary, #171717);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.hook-tooltip__bubble {
  position: fixed;
  z-index: 1000;
  max-width: 16rem;
  padding: 6px 10px;
  border-radius: var(--astryx-radius-control, 8px);
  background: var(--astryx-color-text-primary, #171717);
  color: var(--astryx-color-text-inverse, #fff);
  font-size: 0.75rem;
  line-height: 1.4;
  pointer-events: auto;
}
</style>
