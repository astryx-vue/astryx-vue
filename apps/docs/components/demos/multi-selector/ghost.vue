<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'

const columns = ref(['name', 'email'])
const filters = ref(['active'])
</script>

<template>
  <div class="toolbar">
    <Button label="Refresh" variant="ghost" />
    <MultiSelector
      v-model="columns"
      :options="[
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'status', label: 'Status' },
        { value: 'created', label: 'Created' },
      ]"
      label="Columns"
      label-hidden
      variant="ghost"
      trigger-display="labels"
      placeholder="Columns"
      width="max-content"
    />
    <MultiSelector
      v-model="filters"
      :options="[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'archived', label: 'Archived' },
      ]"
      label="Status"
      label-hidden
      variant="ghost"
      trigger-display="labels"
      placeholder="Status"
      width="max-content"
    />
    <Button label="Export" variant="ghost" />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  max-width: 100%;
}
</style>
