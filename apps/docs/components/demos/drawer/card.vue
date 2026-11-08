<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <div class="drawer-card-preview" aria-hidden="true">
    <div class="drawer-card-preview__content">
      <strong>Results</strong>
      <span />
      <span />
      <span />
    </div>
    <div class="drawer-card-preview__panel">
      <div class="drawer-card-preview__heading">
        <div>
          <strong>Filters</strong>
          <small>Narrow the list</small>
        </div>
        <span class="drawer-card-preview__close">×</span>
      </div>
      <div class="drawer-card-preview__option">
        <span>In stock</span>
        <CheckboxIndicator state="checked" />
      </div>
      <div class="drawer-card-preview__option">
        <span>On sale</span>
        <CheckboxIndicator state="unchecked" />
      </div>
      <Button label="Apply filters" variant="primary" size="sm" width="100%" tabindex="-1" />
    </div>
  </div>
</template>

<style scoped>
.drawer-card-preview {
  display: flex;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border: 1px solid var(--astryx-color-border);
  border-radius: 12px;
  background: var(--astryx-color-background-surface);
  color: var(--astryx-color-text-primary);
}
.drawer-card-preview__content {
  display: grid;
  flex: 1;
  align-content: start;
  gap: 12px;
  min-width: 0;
  padding: 20px 12px;
  color: var(--astryx-color-text-secondary);
}
.drawer-card-preview__content > span {
  height: 8px;
  border-radius: 4px;
  background: var(--astryx-color-background-hover);
}
.drawer-card-preview__content > span:last-child {
  width: 65%;
}
.drawer-card-preview__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(62%, 220px);
  padding: 16px;
  border-left: 1px solid var(--astryx-color-border);
  background: var(--astryx-color-background-popover);
  box-shadow: -12px 0 24px rgb(0 0 0 / 12%);
}
.drawer-card-preview__heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 8px;
}
.drawer-card-preview__heading > div {
  display: grid;
  gap: 2px;
}
.drawer-card-preview__heading small {
  color: var(--astryx-color-text-secondary);
}
.drawer-card-preview__close {
  color: var(--astryx-color-text-secondary);
  font-size: 20px;
  line-height: 1;
}
.drawer-card-preview__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}
.drawer-card-preview__panel > :last-child {
  margin-top: auto;
}
</style>
