<script setup lang="ts">
import { useLayer } from '@astryx-vue/core'

const layer = useLayer({ mode: 'context', placement: 'below', alignment: 'center', gap: 8, lightDismiss: true })
const { isOpen, isMounted, contentStyle, show, hide } = layer

function toggle(): void {
  if (isOpen.value)
    hide()
  else
    show()
}
</script>

<template>
  <div class="hook-layer">
    <button :ref="layer.anchorRef" type="button" class="hook-layer__trigger" @click="toggle">
      {{ isOpen ? 'Hide layer' : 'Show layer' }}
    </button>

    <Teleport to="body">
      <div
        v-if="isMounted"
        v-show="isOpen"
        :id="layer.id"
        :ref="layer.contentRef"
        class="hook-layer__surface"
        :style="contentStyle"
      >
        <p class="hook-layer__title">
          Anchored layer
        </p>
        <p class="hook-layer__body">
          Positioned next to its anchor with useLayer. Clicking outside closes it.
        </p>
        <button type="button" class="hook-layer__action" @click="hide">
          Dismiss
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hook-layer {
  display: flex;
  justify-content: center;
}

.hook-layer__trigger {
  padding: 8px 16px;
  border: 1px solid var(--astryx-color-border, #e5e5e5);
  border-radius: var(--astryx-radius-control, 8px);
  background: var(--astryx-color-background-surface, #fff);
  color: var(--astryx-color-text-primary, #171717);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.hook-layer__surface {
  position: fixed;
  z-index: 1000;
  box-sizing: border-box;
  width: 16rem;
  padding: 12px;
  border: 1px solid var(--astryx-color-border, #e5e5e5);
  border-radius: var(--astryx-radius-container, 12px);
  background: var(--astryx-color-background-surface, #fff);
  box-shadow: 0 4px 8px oklch(0 0 0 / 10%);
  color: var(--astryx-color-text-primary, #171717);
  font-size: 0.875rem;
}

.hook-layer__title {
  margin: 0 0 4px;
  font-weight: 600;
}

.hook-layer__body {
  margin: 0 0 10px;
  color: var(--astryx-color-text-secondary, #525252);
  line-height: 1.5;
}

.hook-layer__action {
  padding: 6px 10px;
  border: 1px solid var(--astryx-color-border, #e5e5e5);
  border-radius: var(--astryx-radius-control, 8px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}
</style>
