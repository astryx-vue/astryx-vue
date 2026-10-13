<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import {
  Avatar,
  Button,
  Card,
  Center,
  Divider,
  HStack,
  Icon,
  Link,
  Section,
  Text,
  TextInput,
  VStack,
} from '@astryx-vue/core'

const BG_URL = '/template-assets/building.png'

const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundImage: `url(${BG_URL})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

type Step = 'email' | 'sso-confirm' | 'password-fallback'

type SSOProvider = {
  name: string
  abbr: string
}

const SSO_PROVIDERS: Record<string, SSOProvider> = {
  'google.com': { name: 'Google Workspace', abbr: 'G' },
  'microsoft.com': { name: 'Microsoft Entra ID', abbr: 'M' },
  'okta.com': { name: 'Okta', abbr: 'O' },
  'meta.com': { name: 'Meta SSO', abbr: 'M' },
  'apple.com': { name: 'Apple Business', abbr: 'A' },
}

function getProvider(email: string) {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? (SSO_PROVIDERS[domain] ?? null) : null
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const step = ref<Step>('email')
const email = ref('')
const password = ref('')
const loginFailed = ref(false)
const isLoading = ref(false)

const provider = computed(() => getProvider(email.value))
const emailValid = computed(() => isValidEmail(email.value))

function handleContinue() {
  if (!emailValid.value)
    return
  if (provider.value)
    step.value = 'sso-confirm'
  else
    step.value = 'password-fallback'
}

function handleBack() {
  step.value = 'email'
  loginFailed.value = false
  isLoading.value = false
}

function handleSignIn() {
  if (!password.value) {
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

function onEmailKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter')
    handleContinue()
}

function onPasswordChange(value: string) {
  password.value = value
  loginFailed.value = false
}
</script>

<template>
  <Center axis="both" :padding="6" :style="pageStyle">
    <Card :padding="8" width="100%" :max-width="400">
      <VStack :gap="4" h-align="stretch">
        <template v-if="step === 'email'">
          <VStack :gap="1" h-align="center">
            <Text type="display-1" as="h2">
              Welcome back
            </Text>
            <Text type="body" color="secondary" size="sm">
              Enter your details to sign in to your account
            </Text>
          </VStack>
          <VStack :gap="2">
            <TextInput
              v-model="email"
              label="Work email"
              is-label-hidden
              type="email"
              placeholder="you@company.com"
              size="lg"
              @keydown="onEmailKeydown"
            />
            <TextInput
              v-model="password"
              label="Password"
              is-label-hidden
              type="password"
              placeholder="Password"
              size="lg"
            />
          </VStack>
          <Link href="#" size="sm" color="secondary" type="supporting">
            Having trouble signing in?
          </Link>
          <Button
            label="Sign in"
            variant="primary"
            size="lg"
            :is-disabled="!emailValid"
            @click="handleContinue"
          />
          <Divider label="Or sign in with" />
          <Button
            label="Continue with SSO"
            variant="secondary"
            size="lg"
            :is-disabled="!emailValid"
            @click="handleContinue"
          />
          <VStack h-align="center">
            <Text type="supporting" color="secondary">
              Don't have an account?
              <Link href="#" type="supporting">
                Request access
              </Link>
            </Text>
          </VStack>
        </template>

        <template v-else-if="step === 'sso-confirm' && provider">
          <VStack :gap="2" h-align="center">
            <Avatar :name="provider.name" :size="48" />
            <Text type="display-3" as="h2">
              Sign in with {{ provider.name }}
            </Text>
            <Text type="body" color="secondary" size="sm">
              You will be redirected back after signing in.
            </Text>
          </VStack>
          <Card :padding="0">
            <Section variant="muted" :padding="4">
              <HStack :gap="2" v-align="center">
                <Icon icon="i-heroicons-shield-check" color="secondary" />
                <VStack :gap="0">
                  <Text type="label">
                    {{ provider.name }}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {{ email }}
                  </Text>
                </VStack>
              </HStack>
            </Section>
          </Card>
          <VStack :gap="3">
            <Button
              :label="`Continue with ${provider.name}`"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="isLoading = true"
            />
            <Button
              label="Use a different email"
              variant="ghost"
              size="lg"
              @click="handleBack"
            />
          </VStack>
        </template>

        <template v-else-if="step === 'password-fallback'">
          <VStack :gap="1" h-align="center">
            <Text type="display-1" as="h2">
              Welcome back
            </Text>
            <Text type="body" color="secondary" size="sm">
              {{ email }}
            </Text>
          </VStack>
          <VStack :gap="4">
            <VStack :gap="1">
              <TextInput
                :model-value="password"
                label="Password"
                type="password"
                size="lg"
                :status="loginFailed ? { type: 'error', message: 'Incorrect password. Try again.' } : undefined"
                @update:model-value="onPasswordChange"
              />
              <VStack v-if="loginFailed" h-align="end">
                <Link href="#" size="sm" color="secondary" type="supporting">
                  Forgot password?
                </Link>
              </VStack>
            </VStack>
            <Button
              label="Sign in"
              variant="primary"
              size="lg"
              :is-loading="isLoading"
              @click="handleSignIn"
            />
            <Button
              label="Use a different email"
              variant="ghost"
              size="lg"
              @click="handleBack"
            />
          </VStack>
        </template>
      </VStack>
    </Card>
  </Center>
</template>
