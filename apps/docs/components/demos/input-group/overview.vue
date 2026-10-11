<script setup lang="ts">
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const domain = ref('')
</script>

<template>
  <InputGroup>
    <template #before>
      <span>https://</span>
    </template>
    <TextInput v-model="domain" label="Domain" is-label-hidden placeholder="example" />
    <template #after>
      <span>.com</span>
    </template>
  </InputGroup>
</template>
