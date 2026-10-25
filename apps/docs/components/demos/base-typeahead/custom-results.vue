<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { VStack } from '@astryx-vue/core/Stack'
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

interface FrameworkItem {
  id: string
  label: string
  auxiliaryData: { category: string }
}

const frameworks: FrameworkItem[] = [
  { id: 'react', label: 'React', auxiliaryData: { category: 'UI library' } },
  { id: 'remix', label: 'Remix', auxiliaryData: { category: 'Web framework' } },
  { id: 'next', label: 'Next.js', auxiliaryData: { category: 'Web framework' } },
]

const source = createStaticSource(frameworks)
const value = ref<FrameworkItem | null>(null)
</script>

<template>
  <div class="base-typeahead-field">
    <BaseTypeahead
      v-model="value"
      :search-source="source"
      label="Search frameworks"
      placeholder="Search frameworks…"
      :debounce-ms="0"
      has-entries-on-focus
    >
      <template #icon>
        <span class="i-carbon-search base-typeahead-field__icon" aria-hidden="true" />
      </template>
      <template #item="{ item }">
        <VStack :gap="0" class="base-typeahead-field__result">
          <span class="base-typeahead-field__label">{{ item.label }}</span>
          <span class="base-typeahead-field__category">{{ item.auxiliaryData.category }}</span>
        </VStack>
      </template>
    </BaseTypeahead>
  </div>
</template>

<style scoped>
.base-typeahead-field {
  box-sizing: border-box;
  width: 22rem;
  max-width: 100%;
}

.base-typeahead-field__icon {
  display: block;
  width: 16px;
  height: 16px;
  color: var(--astryx-color-text-secondary, #525252);
}

.base-typeahead-field__result {
  min-width: 0;
}

.base-typeahead-field__label {
  overflow: hidden;
  color: var(--astryx-color-text-primary, #171717);
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-typeahead-field__category {
  overflow: hidden;
  color: var(--astryx-color-text-secondary, #525252);
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
