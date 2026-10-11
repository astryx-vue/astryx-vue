<script setup lang="ts">
import type { TokenColor } from '@astryx-vue/core/Token'
import { Token } from '@astryx-vue/core/Token'

const colors: TokenColor[] = ['default', 'gray', 'blue', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red', 'pink', 'purple']
</script>

<template>
  <div class="demo-container">
    <Token v-for="color in colors" :key="color" :label="color" :color="color" />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
