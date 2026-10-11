<script setup lang="ts">
import { ref } from 'vue'
import { InputGroup } from '@astryx-vue/core/InputGroup'

const domain = ref('')
</script>

<template>
  <div class="demo-container">
    <InputGroup>
      <template #prepend>
        <span class="input-addon">https://</span>
      </template>
      <input
        v-model="domain"
        type="text"
        placeholder="请输入域名"
        class="input-field"
      >
      <template #append>
        <span class="input-addon">.com</span>
      </template>
    </InputGroup>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 24rem;
}
.input-field {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
  background: transparent;
}
.input-addon {
  padding: 0.5rem 0.75rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-left: 1px solid var(--vp-c-divider);
}
.input-addon:first-child {
  border-left: none;
  border-right: 1px solid var(--vp-c-divider);
}
</style>
