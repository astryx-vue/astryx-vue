<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const domain = ref('')
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <InputGroup label="Website">
      <template #before>
        <InputGroupText>https://</InputGroupText>
      </template>
      <TextInput v-model="domain" label="URL" is-label-hidden placeholder="example" />
      <template #after>
        <InputGroupText>.com</InputGroupText>
      </template>
    </InputGroup>
  </div>
</template>
