<script setup lang="ts">
import { ref } from 'vue'
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'

const username = ref('')
</script>

<template>
  <div class="demo-container">
    <InputGroup>
      <template #before>
        <span>@</span>
      </template>
      <TextInput v-model="username" label="用户名" is-label-hidden placeholder="用户名" />
    </InputGroup>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 24rem;
}
</style>
