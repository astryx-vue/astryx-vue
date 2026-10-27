<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'

const options = ['Name', 'Email', 'Role', 'Status', 'Created']
const selected = ['Role', 'Created']
</script>

<template>
  <div class="overview-field">
    <MultiSelector
      :model-value="selected"
      :options="options"
      label="Columns"
      placeholder="Select columns..."
    />
  </div>
</template>

<style scoped>
.overview-field {
  width: 20rem;
  max-width: 100%;
}
</style>
