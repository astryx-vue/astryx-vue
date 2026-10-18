<script setup lang="ts">
import { useCollapsible } from '@astryx-vue/core/Collapsible'

const { isOpen, isEnabled, toggle } = useCollapsible({ isCollapsible: true })
</script>

<template>
  <div class="hook-collapsible">
    <button
      type="button"
      class="hook-collapsible__trigger"
      :aria-expanded="isOpen"
      aria-controls="use-collapsible-demo-panel"
      @click="toggle"
    >
      <span>Release checklist</span>
      <span class="hook-collapsible__chevron" :data-open="isOpen || undefined" aria-hidden="true" />
    </button>
    <div v-show="isOpen" id="use-collapsible-demo-panel" class="hook-collapsible__panel">
      <p>Review docs, run visual checks, and confirm keyboard behavior before shipping the component update.</p>
      <p class="hook-collapsible__state">
        isEnabled: {{ isEnabled }} · isOpen: {{ isOpen }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.hook-collapsible {
  box-sizing: border-box;
  width: 22rem;
  max-width: 100%;
  border: 1px solid var(--astryx-color-border, #e5e5e5);
  border-radius: var(--astryx-radius-container, 12px);
  color: var(--astryx-color-text-primary, #171717);
  font-size: 0.875rem;
  overflow: hidden;
}

.hook-collapsible__trigger {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 12px 16px;
  border: 0;
  background: var(--astryx-color-background-surface, #fff);
  color: inherit;
  font: inherit;
  font-weight: 600;
  text-align: start;
  cursor: pointer;
}

.hook-collapsible__chevron {
  width: 8px;
  height: 8px;
  border-right: 2px solid currentcolor;
  border-bottom: 2px solid currentcolor;
  transform: rotate(45deg);
  transition: transform 150ms ease;
}

.hook-collapsible__chevron[data-open] {
  transform: rotate(225deg);
}

.hook-collapsible__panel {
  padding: 0 16px 16px;
  border-top: 1px solid var(--astryx-color-border, #e5e5e5);
}

.hook-collapsible__panel p {
  margin: 12px 0 0;
  line-height: 1.5;
}

.hook-collapsible__state {
  color: var(--astryx-color-text-secondary, #525252);
  font-family: var(--astryx-font-family-code, ui-monospace, monospace);
  font-size: 0.75rem;
}
</style>
