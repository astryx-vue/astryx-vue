<script setup lang="ts">
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const selected = ref<string | null>(null)

const options = [
  { value: 'americas', label: 'Americas' },
  { value: 'emea', label: 'EMEA' },
  { value: 'apac', label: 'APAC' },
]

// Only the Selector placeholder changes; every other string stays the built-in English.
const overrides = {
  en: {
    '@astryx.selector.placeholder': 'Choose...',
  },
}
</script>

<template>
  <div class="internationalization-provider-preview">
    <InternationalizationProvider locale="en" :overrides="overrides">
      <Selector
        v-model="selected"
        label="Billing region"
        :options="options"
        :width="240"
        has-clear
      />
    </InternationalizationProvider>
  </div>
</template>
