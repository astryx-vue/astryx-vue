<script setup lang="ts">
import { useHoverCard } from '@astryx-vue/core/HoverCard'

const card = useHoverCard({ label: 'Alex Morgan', delay: 150 })
const { isOpen, contentStyle, contentProps } = card
</script>

<template>
  <div class="hook-hover-card">
    <button :ref="card.triggerRef" type="button" class="hook-hover-card__trigger">
      Hover profile
    </button>

    <Teleport to="body">
      <div
        v-show="isOpen"
        :ref="card.contentRef"
        v-bind="contentProps"
        class="hook-hover-card__surface"
        :style="contentStyle"
      >
        <p class="hook-hover-card__name">
          Alex Morgan
        </p>
        <p class="hook-hover-card__role">
          Staff designer · Product systems
        </p>
        <p class="hook-hover-card__bio">
          Owns interaction patterns for overlays and navigation.
        </p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hook-hover-card {
  display: flex;
  justify-content: center;
}

.hook-hover-card__trigger {
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

.hook-hover-card__surface {
  position: fixed;
  z-index: 1000;
  box-sizing: border-box;
  width: 16rem;
  padding: 14px;
  border: 1px solid var(--astryx-color-border, #e5e5e5);
  border-radius: var(--astryx-radius-container, 12px);
  background: var(--astryx-color-background-surface, #fff);
  box-shadow: 0 4px 8px oklch(0 0 0 / 10%);
  color: var(--astryx-color-text-primary, #171717);
  font-size: 0.875rem;
}

.hook-hover-card__name {
  margin: 0;
  font-weight: 600;
}

.hook-hover-card__role {
  margin: 2px 0 8px;
  color: var(--astryx-color-text-secondary, #525252);
  font-size: 0.75rem;
}

.hook-hover-card__bio {
  margin: 0;
  line-height: 1.5;
}
</style>
