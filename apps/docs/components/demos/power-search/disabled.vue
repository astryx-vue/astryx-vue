<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { createPowerSearchConfig, PowerSearch } from '@astryx-vue/core/PowerSearch'
import { ref } from 'vue'

const { config } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
] as const)

const filters = ref<PowerSearchFilter[]>([
  { field: 'name', operator: 'contains', value: { type: 'string', value: 'Ada' }, isReadOnly: true },
])
</script>

<template>
  <PowerSearch
    v-model:filters="filters"
    :config="config"
    disabled
    disabled-reason="Search is paused while the index rebuilds."
  />
</template>
