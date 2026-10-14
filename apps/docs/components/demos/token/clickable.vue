<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <div class="demo-row">
    <Token label="Bug" color="red" @click="() => {}" />
    <Token label="Feature" color="blue" @click="() => {}" />
    <Token label="Enhancement" color="green" @click="() => {}" />
    <Token label="Documentation" color="gray" @click="() => {}" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
