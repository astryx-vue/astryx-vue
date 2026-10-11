<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const view = shallowRef('board')
</script>

<template>
  <ToggleButtonGroup v-model:value="view" label="View mode">
    <ToggleButton value="list" label="List" />
    <ToggleButton value="board" label="Board" />
    <ToggleButton value="timeline" label="Timeline" />
  </ToggleButtonGroup>
</template>
