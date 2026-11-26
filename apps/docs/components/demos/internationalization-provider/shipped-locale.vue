<script setup lang="ts">
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import frFR from '@astryx-vue/core/locales/fr-FR.json'
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const selected = ref<string | null>(null)

const options = [
  { value: 'americas', label: 'Amériques' },
  { value: 'emea', label: 'EMEA' },
  { value: 'apac', label: 'APAC' },
]
</script>

<template>
  <div class="internationalization-provider-preview">
    <InternationalizationProvider locale="fr-FR" :messages="{ 'fr-FR': frFR }">
      <Selector
        v-model="selected"
        label="Région de facturation"
        :options="options"
        :width="240"
        has-clear
      />
    </InternationalizationProvider>
  </div>
</template>
