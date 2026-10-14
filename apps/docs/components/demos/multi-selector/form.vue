<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'

const columns = ref(['name', 'email'])
const filters = ref<string[]>([])
</script>

<template>
  <div class="demo-stack">
    <MultiSelector
      v-model="columns"
      :options="[
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'status', label: 'Status' },
        { value: 'created', label: 'Created at' },
      ]"
      label="Visible columns"
      description="Choose which columns to display in the table"
      required
      select-all
      trigger-display="labels"
    />
    <MultiSelector
      v-model="filters"
      :options="[
        'Active',
        'Inactive',
        'Pending',
        'Archived',
      ]"
      label="Status filter"
      description="Filter by status"
      placeholder="All statuses"
      optional
      trigger-display="badges"
    />
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
