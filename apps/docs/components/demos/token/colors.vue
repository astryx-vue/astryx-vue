<script setup lang="ts">
import type { TokenColor } from '@astryx-vue/core/Token'
import { Token } from '@astryx-vue/core/Token'

const colors: { color: TokenColor, label: string }[] = [
  { color: 'default', label: 'Default' },
  { color: 'red', label: 'Red' },
  { color: 'orange', label: 'Orange' },
  { color: 'yellow', label: 'Yellow' },
  { color: 'green', label: 'Green' },
  { color: 'teal', label: 'Teal' },
  { color: 'cyan', label: 'Cyan' },
  { color: 'blue', label: 'Blue' },
  { color: 'purple', label: 'Purple' },
  { color: 'pink', label: 'Pink' },
  { color: 'gray', label: 'Gray' },
]
</script>

<template>
  <div class="demo-stack">
    <p class="demo-caption">
      {{ 'Default' }}
    </p>
    <div class="demo-row">
      <Token v-for="item in colors" :key="item.color" :label="item.label" :color="item.color" />
    </div>
    <p class="demo-caption">
      {{ 'Disabled' }}
    </p>
    <div class="demo-row">
      <Token v-for="item in colors" :key="`disabled-${item.color}`" :label="item.label" :color="item.color" disabled />
    </div>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 25rem;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.demo-caption {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
.demo-caption:first-child {
  margin-top: 0;
}
</style>
