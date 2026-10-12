<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('grid')
</script>

<template>
  <ToggleButtonGroup v-model:value="view" label="View mode">
    <ToggleButton label="List" value="list" />
    <ToggleButton label="Grid" value="grid" />
    <ToggleButton label="Board" value="board" />
  </ToggleButtonGroup>
</template>
