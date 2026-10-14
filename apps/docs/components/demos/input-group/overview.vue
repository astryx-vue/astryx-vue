<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const price = ref('')
const domain = ref('')
</script>

<template>
  <VStack :gap="4" style="width: min(100%, 360px)">
    <InputGroup label="Price">
      <template #before>
        <InputGroupText>$</InputGroupText>
      </template>
      <TextInput v-model="price" label="Amount" is-label-hidden placeholder="0.00" />
    </InputGroup>
    <InputGroup label="Website">
      <template #before>
        <InputGroupText>https://</InputGroupText>
      </template>
      <TextInput v-model="domain" label="URL" is-label-hidden placeholder="example" />
      <template #after>
        <InputGroupText>.com</InputGroupText>
      </template>
    </InputGroup>
  </VStack>
</template>
