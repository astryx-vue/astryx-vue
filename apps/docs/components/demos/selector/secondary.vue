<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const priority = ref('normal')
</script>

<template>
  <Selector
    v-model="priority"
    label="Priority"
    variant="secondary"
    :options="[
      { value: 'low', label: 'Low' },
      { value: 'normal', label: 'Normal' },
      { value: 'high', label: 'High' },
    ]"
  />
</template>
