<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'

const selected = ref(['name', 'email', 'role', 'status'])
const options = computed(() => [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' },
  { value: 'status', label: 'Status' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'actions', label: 'Actions' },
])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="options"
      label="Columns"
      label-hidden
      placeholder="Columns"
      searchable
      select-all
      trigger-display="count"
    />
  </div>
</template>

<style scoped>
.demo-field {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
