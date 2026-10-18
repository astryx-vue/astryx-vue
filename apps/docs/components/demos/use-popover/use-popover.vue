<script setup lang="ts">
import { usePopover } from '@astryx-vue/core/Popover'

const popover = usePopover({
  dialogLabel: 'Quick actions',
  closeButtonSelector: '.hook-popover__close',
})
const { isOpen, surfaceProps, contentStyle, toggle, hide } = popover
</script>

<template>
  <div class="hook-popover">
    <button
      :ref="popover.triggerRef"
      type="button"
      class="hook-popover__trigger"
      @click="toggle"
    >
      Open actions
    </button>

    <Teleport to="body">
      <div
        v-show="isOpen"
        :ref="popover.contentRef"
        v-bind="surfaceProps"
        class="hook-popover__surface"
        :style="contentStyle"
      >
        <p class="hook-popover__title">
          Quick actions
        </p>
        <div class="hook-popover__actions">
          <button type="button" class="hook-popover__action">
            Duplicate
          </button>
          <button type="button" class="hook-popover__action">
            Archive
          </button>
        </div>
        <button type="button" class="hook-popover__close" @click="hide">
          Close
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hook-popover {
  display: flex;
  justify-content: center;
}

.hook-popover__trigger {
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

.hook-popover__surface {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  width: 15rem;
  padding: 12px;
  border: 1px solid var(--astryx-color-border, #e5e5e5);
  border-radius: var(--astryx-radius-container, 12px);
  background: var(--astryx-color-background-surface, #fff);
  box-shadow: 0 4px 8px oklch(0 0 0 / 10%);
  color: var(--astryx-color-text-primary, #171717);
  font-size: 0.875rem;
}

.hook-popover__title {
  margin: 0;
  font-weight: 600;
}

.hook-popover__actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hook-popover__action {
  padding: 6px 8px;
  border: 0;
  border-radius: var(--astryx-radius-control, 8px);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.hook-popover__action:hover {
  background: var(--astryx-color-background-muted, #f5f5f5);
}

.hook-popover__close {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: var(--astryx-color-text-secondary, #525252);
  font: inherit;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;
}
</style>
