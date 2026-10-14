<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
</script>

<template>
  <div class="demo-container">
    <p class="demo-caption">
      {{ 'Active filters' }}
    </p>
    <div class="demo-row">
      <Token label="Status: Open" color="green" removable />
      <Token label="Priority: High" color="red" removable />
      <Token label="Team: Design" color="purple" removable />
    </div>
    <p class="demo-caption">
      {{ 'Selected recipients' }}
    </p>
    <div class="demo-row">
      <Token label="Sarah Chen" color="blue" removable />
      <Token label="Alex Rivera" color="blue" removable />
      <Token label="Jordan Lee" color="blue" removable />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.demo-caption {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
.demo-caption:first-child {
  margin-top: 0;
}
</style>
