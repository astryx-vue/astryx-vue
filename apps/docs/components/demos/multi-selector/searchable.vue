<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'

const selected = ref<string[]>([])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="[
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Brazil',
        'India',
        'Mexico',
      ]"
      label="Countries"
      placeholder="Select countries..."
      searchable
      select-all
    />
  </div>
</template>

<style scoped>
.demo-field {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
