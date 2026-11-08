<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <div class="tour-overview" aria-hidden="true">
    <div class="tour-overview__actions">
      <span class="tour-overview__target">Save draft</span>
      <span>Share</span>
      <span>History</span>
    </div>
    <div class="tour-overview__callout">
      <strong>Save your work</strong>
      <span>Changes save automatically to the cloud.</span>
      <div class="tour-overview__footer">
        <small>1 of 3</small>
        <Button label="Next" variant="primary" size="sm" tabindex="-1" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tour-overview {
  width: min(100%, 340px);
  color: var(--astryx-color-text-primary);
  font-family: var(--astryx-font-family-body, Figtree, sans-serif);
}
.tour-overview__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--astryx-color-text-secondary);
  font-size: 14px;
}
.tour-overview__target {
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--astryx-color-text-primary);
  box-shadow:
    0 0 0 2px var(--astryx-color-background-surface),
    0 0 0 4px var(--astryx-color-accent);
}
.tour-overview__callout {
  display: grid;
  gap: 10px;
  width: min(260px, calc(100% - 12px));
  margin-top: 8px;
  margin-inline-start: 12px;
  padding: 16px;
  border: 1px solid var(--astryx-color-border);
  border-radius: 12px;
  background: var(--astryx-color-background-popover);
  box-shadow: var(--astryx-shadow-med, 0 8px 24px rgb(0 0 0 / 18%));
}
.tour-overview__callout > span {
  color: var(--astryx-color-text-secondary);
  font-size: 13px;
  line-height: 1.45;
}
.tour-overview__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tour-overview__footer small {
  color: var(--astryx-color-text-secondary);
}
</style>
