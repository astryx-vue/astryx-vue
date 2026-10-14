<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const domain = ref('')
</script>

<template>
  <InputGroup label="Website" description="Public address" is-required>
    <template #before>
      <InputGroupText>https://</InputGroupText>
    </template>
    <TextInput v-model="domain" label="Domain" is-label-hidden placeholder="example" />
    <template #after>
      <InputGroupText>.com</InputGroupText>
    </template>
  </InputGroup>
</template>
