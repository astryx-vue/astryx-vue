<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'

const selected = ref<string[]>([])
const options = computed(() => [
  {
    type: 'section' as const,
    label: 'Read',
    options: [
      { value: 'read_posts', label: 'Read posts' },
      { value: 'read_comments', label: 'Read comments' },
      { value: 'read_users', label: 'Read users' },
    ],
  },
  {
    type: 'section' as const,
    label: 'Write',
    options: [
      { value: 'write_posts', label: 'Write posts' },
      { value: 'write_comments', label: 'Write comments' },
    ],
  },
])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="options"
      label="Permissions"
      placeholder="Select permissions..."
    />
  </div>
</template>

<style scoped>
.demo-field {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
