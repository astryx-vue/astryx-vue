<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const price = ref('')
</script>

<template>
  <InputGroup label="Price">
    <template #before>
      <InputGroupText>$</InputGroupText>
    </template>
    <TextInput v-model="price" label="Amount" is-label-hidden placeholder="0.00" />
    <template #after>
      <InputGroupText>USD</InputGroupText>
    </template>
  </InputGroup>
</template>
