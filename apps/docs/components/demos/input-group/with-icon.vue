<script setup lang="ts">
import { ref } from 'vue'
import { InputGroup } from '@astryx-vue/core/InputGroup'

const username = ref('')
</script>

<template>
  <div class="demo-container">
    <InputGroup>
      <template #prepend>
        <span class="icon i-lucide-user" />
      </template>
      <input
        v-model="username"
        type="text"
        placeholder="用户名"
        class="input-field"
      >
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
.icon {
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0 0.75rem;
}
</style>
