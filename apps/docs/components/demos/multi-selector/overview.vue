<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'

const value = ref<string[]>([])
</script>

<template>
  <div style="width: 300px">
    <MultiSelector
      v-model="value"
      label="Columns"
      :options="['Name', 'Email', 'Role', 'Status', 'Created']"
      placeholder="Select columns..."
    />
  </div>
</template>
