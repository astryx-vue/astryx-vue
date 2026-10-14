<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { createPowerSearchConfig, PowerSearch } from '@astryx-vue/core/PowerSearch'
import { ref } from 'vue'

const { config } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'city', type: 'string', label: 'City' },
  { key: 'team', type: 'string', label: 'Team' },
  { key: 'active', type: 'boolean', label: 'Active' },
] as const)

const filters = ref<PowerSearchFilter[]>([
  { field: 'name', operator: 'contains', value: { type: 'string', value: 'li' } },
  { field: 'city', operator: 'starts_with', value: { type: 'string', value: 'San' } },
  { field: 'team', operator: 'is', value: { type: 'string', value: 'Design' } },
  { field: 'active', operator: 'is_true', value: { type: 'empty' } },
])
</script>

<template>
  <div class="power-search-narrow">
    <PowerSearch
      v-model:filters="filters"
      :config="config"
      overflow="unfocused-inline"
    />
  </div>
</template>

<style scoped>
.power-search-narrow {
  width: min(100%, 280px);
}
</style>
