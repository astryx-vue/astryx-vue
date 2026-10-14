<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const sm = ref('')
const md = ref('')
const lg = ref('')
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="3">
      <TextInput v-model="sm" label="Small" placeholder="Enter a value" size="sm" />
      <TextInput v-model="md" label="Medium" placeholder="Enter a value" size="md" />
      <TextInput v-model="lg" label="Large" placeholder="Enter a value" size="lg" />
    </VStack>
  </div>
</template>
