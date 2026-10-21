<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { h, ref } from 'vue'

const city = ref('paris')
const edited = ref('')

function edit(name: string) {
  return h('button', {
    type: 'button',
    onClick: () => {
      edited.value = name
    },
  }, 'Edit')
}
</script>

<template>
  <div>
    <Selector
      v-model="city"
      label="City"
      :options="[
        { value: 'paris', label: 'Paris', action: edit('Paris') },
        { value: 'lyon', label: 'Lyon', action: edit('Lyon') },
      ]"
    />
    <p v-if="edited">Last edited: {{ edited }}</p>
  </div>
</template>
