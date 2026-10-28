<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  Button,
  Card,
  Center,
  Divider,
  Heading,
  Icon,
  Link,
  Text,
  TextInput,
  VStack,
} from '@astryx-vue/core'
import { ref } from 'vue'

const pageStyle: CSSProperties = {
  backgroundColor: 'var(--astryx-color-background-body)',
}

const email = ref('')
const password = ref('')
const loginFailed = ref(false)
const isLoading = ref(false)

function handleLogin() {
  if (!email.value || !password.value) {
    loginFailed.value = true
    return
  }
  isLoading.value = true
  loginFailed.value = false
  window.setTimeout(() => {
    isLoading.value = false
    loginFailed.value = true
  }, 2000)
}

function onPasswordChange(value: string) {
  password.value = value
  loginFailed.value = false
}
</script>

<template>
  <Center axis="both" :padding="6" min-height="100%" :style="pageStyle">
    <VStack :gap="4" h-align="center" width="100%" :max-width="400">
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
              Welcome back
            </Heading>
            <Text type="body" color="secondary" size="sm">
              Sign in to your account
            </Text>
          </VStack>
          <VStack :gap="2">
            <TextInput
              v-model="email"
              label="Email"
              is-label-hidden
              type="email"
              placeholder="name@company.com"
              size="lg"
            />
            <VStack :gap="1">
              <TextInput
                :model-value="password"
                label="Password"
                is-label-hidden
                placeholder="Enter your password"
                type="password"
                size="lg"
                :status="loginFailed ? { type: 'error', message: 'Incorrect password. Try again.' } : undefined"
                @update:model-value="onPasswordChange"
              />
              <VStack v-if="loginFailed" h-align="end">
                <Link href="#" size="sm" color="secondary">
                  Forgot password?
                </Link>
              </VStack>
            </VStack>
          </VStack>
          <Button
            label="Login"
            variant="primary"
            size="lg"
            :is-loading="isLoading"
            @click="handleLogin"
          />
          <Divider label="Or continue with" />
          <VStack :gap="3" h-align="stretch">
            <Button label="Login with Apple" variant="secondary" size="lg">
              <template #icon>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="width: 16px; height: 16px" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </template>
            </Button>
            <Button label="Login with Google" variant="secondary" size="lg">
              <template #icon>
                <svg viewBox="0 0 24 24" width="16" height="16" style="width: 16px; height: 16px" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </template>
            </Button>
          </VStack>
          <VStack h-align="center">
            <Text type="supporting" color="secondary">
              Don't have an account?
              <Link href="#" size="sm">
                Sign up
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Card>
      <VStack h-align="center" width="100%">
        <Text type="supporting" color="secondary" justify="center">
          By clicking continue, you agree to our
          <Link href="#" size="sm">
            Terms of Service
          </Link>
          and
          <Link href="#" size="sm">
            Privacy Policy
          </Link>.
        </Text>
      </VStack>
    </VStack>
  </Center>
</template>
