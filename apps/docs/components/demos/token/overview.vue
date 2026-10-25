<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <div class="overview-tokens">
    <Token label="Design" />
    <Token label="Review" color="blue" removable />
    <Token label="Ready" color="green" />
  </div>
</template>

<style scoped>
.overview-tokens {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
</style>
