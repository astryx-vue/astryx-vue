<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <VStack :gap="4" width="100%" style="max-width: 320px">
    <TextInput
      v-model="email"
      label="Email"
      description="We'll send a confirmation link to this address"
      placeholder="you@example.com"
    />
    <TextInput
      v-model="password"
      label="Password"
      description="At least 8 characters with one uppercase letter"
      placeholder="Create a password"
    />
  </VStack>
</template>
