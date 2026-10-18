<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

provideAstryxLocale('en')

const value = ref<{ id: string, label: string } | null>(null)
const source = createStaticSource([
  { id: 'react', label: 'React' },
  { id: 'remix', label: 'Remix' },
  { id: 'next', label: 'Next.js' },
])
</script>

<template>
  <div class="base-typeahead-stage">
    <BaseTypeahead
      v-model="value"
      :search-source="source"
      label="Search frameworks"
      placeholder="Search frameworks…"
      :debounce-ms="0"
    >
      <template #icon>
        <span class="i-carbon-search base-typeahead-stage__icon" aria-hidden="true" />
      </template>
    </BaseTypeahead>
    <span class="base-typeahead-stage__note">{{ value ? value.label : 'No selection' }}</span>
  </div>
</template>

<style scoped>
.base-typeahead-stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  width: 22rem;
  max-width: 100%;
}

.base-typeahead-stage__icon {
  display: block;
  width: 16px;
  height: 16px;
  color: var(--astryx-color-text-secondary, #525252);
}

.base-typeahead-stage__note {
  color: var(--astryx-color-text-secondary, #525252);
  font-size: 0.875rem;
}
</style>
