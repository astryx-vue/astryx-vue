<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const content = shallowRef('Type here to simulate an async save.')

async function save(value: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800))
  // eslint-disable-next-line no-console
  console.log('saved', value)
}
</script>

<template>
  <div class="input-preview-grid">
    <TextArea v-model="content" label="Content" :change-action="save" />
  </div>
</template>
