<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'

const value = ref<string[]>([])
const options = ['Design', 'Engineering', 'Marketing', 'Operations']
</script>

<template>
  <div class="bottom-sheet-field">
    <MultiSelector
      v-model="value"
      label="Teams"
      :options="options"
      placeholder="Choose teams"
      presentation="bottom-sheet"
      select-all
    />
  </div>
</template>

<style scoped>
.bottom-sheet-field {
  width: 320px;
  max-width: 100%;
}
</style>
