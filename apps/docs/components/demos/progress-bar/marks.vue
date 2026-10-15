<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
</script>

<template>
  <ProgressBar
    :value="62"
    label="Upload"
    style="width: 320px"
    :marks="[
      { value: 25, label: 'Started' },
      { value: 90, label: 'Almost done' },
    ]"
  />
</template>
