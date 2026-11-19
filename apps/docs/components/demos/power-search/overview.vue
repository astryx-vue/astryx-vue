<script setup lang="ts">
import type { PowerSearchConfig, PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { PowerSearch } from '@astryx-vue/core/PowerSearch'
import { ref } from 'vue'

const config: PowerSearchConfig = {
  name: 'BasicSearch',
  fields: [
    {
      key: 'status',
      label: 'Status',
      defaultOperator: 'is',
      operators: [
        {
          key: 'is',
          label: 'is',
          value: {
            type: 'enum',
            values: [
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'closed', label: 'Closed' },
            ],
          },
        },
      ],
    },
    {
      key: 'title',
      label: 'Title',
      defaultOperator: 'contains',
      operators: [
        { key: 'contains', label: 'contains', value: { type: 'string' } },
      ],
    },
  ],
}

const filters = ref<PowerSearchFilter[]>([
  { field: 'status', operator: 'is', value: { type: 'enum', value: 'open' } },
  { field: 'title', operator: 'contains', value: { type: 'string', value: 'dashboard' } },
])
</script>

<template>
  <div class="power-search-overview">
    <PowerSearch
      v-model:filters="filters"
      :config="config"
      placeholder="Search by status, title..."
    />
  </div>
</template>

<style scoped>
.power-search-overview {
  display: grid;
  grid-template-columns: minmax(0, 400px);
}
</style>
