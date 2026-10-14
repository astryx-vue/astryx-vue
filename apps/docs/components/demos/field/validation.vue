<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const email = ref('bad-email')
const username = ref('admin')
const apiKey = ref('sk-live-abc123')
</script>

<template>
  <VStack :gap="4" width="100%" style="max-width: 320px">
    <TextInput
      v-model="email"
      label="Email"
      description="Enter your work email"
      :status="{ type: 'error', message: 'Please enter a valid email address' }"
    />
    <TextInput
      v-model="username"
      label="Username"
      description="Choose a unique username"
      :status="{ type: 'warning', message: 'This username is reserved for administrators' }"
    />
    <TextInput
      v-model="apiKey"
      label="API Key"
      description="Paste your API key"
      :status="{ type: 'success', message: 'API key is valid and active' }"
    />
  </VStack>
</template>
