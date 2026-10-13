<script setup lang="ts">
import type { ThemeId } from './themeCatalog'
import { Text } from '@astryx-vue/core/Text'
import { useData } from 'vitepress'
import { computed, shallowRef } from 'vue'
import { themeCatalog } from './themeCatalog'
import ThemeStage from './ThemeStage.vue'

const current = shallowRef<ThemeId>('neutral')
const { isDark } = useData()
const colorMode = computed(() => isDark.value ? 'dark' : 'light')

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
          :data-astryx-color-mode="item.id === 'gothic' ? 'dark' : colorMode"
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
  margin: 24px 0 8px;
}

.theme-gallery__picker {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.theme-gallery__picker button {
  flex: 0 0 200px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
}

.theme-gallery__picker button.is-selected {
  outline: 2px solid var(--vp-c-brand-1, #10b981);
  outline-offset: 2px;
}

.theme-gallery__swatch {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  min-height: 112px;
  padding: 12px;
  border-radius: 12px;
  background-color: var(--astryx-color-background-body);
  background-position: center;
  background-size: cover;
  color: var(--astryx-color-text-primary);
  text-align: start;
}

.theme-gallery__swatch :deep(.astryx-text) {
  line-height: 1.05;
}
</style>
