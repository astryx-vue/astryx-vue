<script setup lang="ts">
import { ref } from 'vue'
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'

const domain = ref('')
</script>

<template>
  <div class="demo-container">
    <InputGroup>
      <template #before>
        <span>https://</span>
      </template>
      <TextInput v-model="domain" label="域名" is-label-hidden placeholder="example" />
      <template #after>
        <span>.com</span>
      </template>
    </InputGroup>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 24rem;
}
</style>
