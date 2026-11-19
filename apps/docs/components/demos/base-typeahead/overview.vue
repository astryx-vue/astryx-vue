<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Icon } from '@astryx-vue/core/Icon'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

const frameworks: SearchableItem[] = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'solid', label: 'SolidJS' },
  { id: 'remix', label: 'Remix' },
  { id: 'next', label: 'Next.js' },
  { id: 'nuxt', label: 'Nuxt' },
]

const source = createStaticSource(frameworks)
const value = ref<SearchableItem | null>(null)
const wrapper = ref<HTMLElement | null>(null)
</script>

<template>
  <VStack :gap="3" class="base-typeahead-showcase">
    <div ref="wrapper" class="base-typeahead-showcase__field">
      <Icon icon="i-heroicons-magnifying-glass" size="sm" color="secondary" />
      <BaseTypeahead
        v-model="value"
        label="Search frameworks"
        :search-source="source"
        :anchor-ref="wrapper"
        placeholder="Search frameworks…"
        has-entries-on-focus
        :debounce-ms="0"
      />
    </div>
    <Text type="supporting" color="secondary">
      {{ value != null ? `Selected: ${value.label}` : 'No selection' }}
    </Text>
  </VStack>
</template>

<style scoped>
.base-typeahead-showcase {
  width: 100%;
  max-width: 360px;
}

/* 原版用 HStack gap=2 vAlign=center 加 StyleX 画的输入框外壳。 */
.base-typeahead-showcase__field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-block: 6px;
  padding-inline: 8px;
  border: var(--astryx-border-width) solid var(--astryx-color-border);
  border-radius: var(--astryx-radius-element);
  background-color: var(--astryx-color-background-surface);
  outline: 0 solid transparent;
  outline-offset: var(--astryx-focus-outline-offset);
}

.base-typeahead-showcase__field:has(input:focus-visible) {
  outline-color: var(--astryx-focus-outline-color);
  outline-width: var(--astryx-focus-outline-width);
}
</style>
