<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'

const selected = ref<string[]>([])
const options = computed(() => [
  'Design',
  'Engineering',
  'Marketing',
  'Operations',
])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="options"
      label="Teams"
      placeholder="Choose teams"
      presentation="bottom-sheet"
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
