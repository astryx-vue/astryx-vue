<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const saved = ref('banana')
const pending = ref<string | null>(null)
const required = ref<string | null>(null)
const search = ref<string | null>('apple')
const locked = ref<string | null>('banana')
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <VStack :gap="6">
      <Selector v-model="saved" label="Saved fruit" :options="fruits" is-read-only />
      <Selector v-model="pending" label="Catalog" :options="[]" is-loading placeholder="Loading fruit" />
      <Selector v-model="required" label="Required fruit" :options="fruits" is-required />
      <Selector
        v-model="locked"
        label="Locked fruit"
        :options="fruits"
        disabled
        disabled-message="Only the owner of this list can change it"
      />
      <Selector
        v-model="search"
        label="Search fruit"
        :options="fruits"
        searchable
        indicator-position="start"
        empty-search-text="Nothing like that"
      />
    </VStack>
  </div>
</template>
