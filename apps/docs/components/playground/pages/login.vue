<script setup lang="ts">
import {
  Banner,
  Button,
  Card,
  Center,
  Heading,
  Icon,
  Text,
  TextInput,
  VStack,
} from '@astryx-vue/core'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

function signIn() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.'
    return
  }
  isLoading.value = true
  setTimeout(() => { isLoading.value = false }, 2000)
}
</script>

<template>
  <Center axis="both" :padding="6" class="login-page">
    <VStack :gap="4" h-align="center" class="login-column">
      <VStack :gap="2" h-align="center">
        <Icon name="heroicons:cube" size="lg" />
        <Text type="body" weight="bold" size="lg">
          Product Inc.
        </Text>
      </VStack>

      <Card :padding="8" width="100%">
        <VStack :gap="4" h-align="stretch">
          <VStack :gap="1" h-align="center">
            <Heading :level="2">
              Sign in
            </Heading>
            <Text type="body" color="secondary" size="sm">
              Enter your credentials to continue
            </Text>
          </VStack>

          <Banner v-if="error" status="error" :title="error" container="card" />

          <TextInput
            v-model="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            size="lg"
          />

          <TextInput
            v-model="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            size="lg"
          />

          <Button
            label="Sign in"
            variant="primary"
            size="lg"
            :is-loading="isLoading"
            @click="signIn"
          />
        </VStack>
      </Card>
    </VStack>
  </Center>
</template>

<style>
.login-page {
  min-height: 100%;
  background-color: var(--astryx-color-background-body);
}
.login-column {
  width: 100%;
  max-width: 400px;
}
</style>
