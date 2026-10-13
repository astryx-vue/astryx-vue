<script setup lang="ts">
import type { ThemeId } from './themeCatalog'
import { Text } from '@astryx-vue/core/Text'
import { shallowRef } from 'vue'
import { themeCatalog } from './themeCatalog'
import ThemeStage from './ThemeStage.vue'

const current = shallowRef<ThemeId>('neutral')

function select(id: ThemeId) {
  current.value = id
}
</script>

<template>
  <div class="theme-gallery astryx-demo">
    <div class="theme-gallery__picker" role="listbox" aria-label="Theme">
      <button
        v-for="item in themeCatalog"
        :key="item.id"
        type="button"
        role="option"
        :aria-selected="item.id === current"
        :class="{ 'is-selected': item.id === current }"
        @click="select(item.id)"
      >
        <span
          class="theme-gallery__swatch"
          :data-astryx-theme="item.id"
          :data-astryx-color-mode="item.id === 'gothic' ? 'dark' : 'light'"
          :style="item.picker ? { backgroundImage: `url(${item.picker})` } : undefined"
        >
          <Text type="display-3">
            {{ item.label }}
          </Text>
        </span>
      </button>
    </div>
    <ThemeStage :theme="current" />
  </div>
</template>

<style scoped>
.theme-gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 24px 0 8px;
}

.theme-gallery__picker {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.theme-gallery__picker button {
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
}

.theme-gallery__picker button:focus,
.theme-gallery__picker button:focus-visible {
  outline: none;
}

.theme-gallery__picker button.is-selected .theme-gallery__swatch,
.theme-gallery__picker button:focus-visible .theme-gallery__swatch {
  box-shadow: inset 0 0 0 2px #15110c;
}

.theme-gallery__swatch {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  min-height: 120px;
  height: 100%;
  padding: 12px;
  overflow: hidden;
  border-radius: 16px;
  background-color: var(--astryx-color-background-body);
  background-position: center;
  background-size: cover;
  color: var(--astryx-color-accent);
  text-align: start;
}

.theme-gallery__swatch :deep(.astryx-text) {
  max-width: 100%;
  padding: 0.02em 0.28em;
  border-radius: 0.2em;
  background: color-mix(in srgb, var(--astryx-color-background-body) 82%, transparent);
  color: var(--astryx-color-accent);
  font-size: clamp(1.15rem, 1.4vw, 1.5rem);
  line-height: 1.05;
}

@media (max-width: 800px) {
  .theme-gallery {
    width: auto;
    max-width: none;
    margin-right: 0;
  }

  .theme-gallery__picker {
    display: flex;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .theme-gallery__picker button {
    flex: 0 0 168px;
  }
}
</style>
