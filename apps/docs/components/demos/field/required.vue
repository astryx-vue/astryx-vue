<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const username = ref('')
const email = ref('')
</script>

<template>
  <VStack :gap="4" width="100%" style="max-width: 320px">
    <TextInput v-model="username" label="Username" is-required placeholder="Enter your username" />
    <TextInput v-model="email" label="Backup email" is-optional placeholder="you@example.com" />
  </VStack>
</template>
