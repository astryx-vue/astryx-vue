<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { BaseTypeahead } from '@astryx-vue/core/Typeahead'
import { ref } from 'vue'

provideAstryxLocale('en')

const frame = ref<HTMLElement | null>(null)
const value = ref<{ id: string, label: string } | null>(null)
const source = createStaticSource([
  { id: 'react', label: 'React' },
  { id: 'remix', label: 'Remix' },
  { id: 'next', label: 'Next.js' },
])
</script>

<template>
  <div class="base-typeahead-stage">
    <div ref="frame" class="base-typeahead-stage__frame">
      <span class="i-carbon-search base-typeahead-stage__icon" aria-hidden="true" />
      <BaseTypeahead
        v-model="value"
        :anchor-ref="frame"
        :search-source="source"
        label="Search frameworks"
        placeholder="Search frameworks…"
        :debounce-ms="0"
      />
    </div>
    <span class="base-typeahead-stage__note">{{ value ? value.label : 'No selection' }}</span>
  </div>
</template>

<style scoped>
.base-typeahead-stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  width: 360px;
  max-width: 100%;
}

.base-typeahead-stage__frame {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding: 6px 8px;
  border: 1px solid var(--astryx-color-border-subtle, light-dark(#0000001a, #ffffff1a));
  border-radius: var(--astryx-radius-element, 0.625rem);
  background: var(--astryx-input-background, light-dark(#fff, #262626));
}

.base-typeahead-stage__frame:focus-within {
  border-color: var(--astryx-input-focus, light-dark(#262626, #fafafa));
}

.base-typeahead-stage__icon {
  flex: none;
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
