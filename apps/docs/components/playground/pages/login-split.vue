<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  Button,
  Card,
  Center,
  Divider,
  EmptyState,
  Grid,
  HStack,
  Icon,
  Link,
  Section,
  StackItem,
  Text,
  TextInput,
  VStack,
} from '@astryx-vue/core'
import { ref } from 'vue'

const COVER_IMAGE_URL = '/template-assets/light-working-vertical-1.png'
const APPLE_LOGO_URL = '/template-assets/AppleLogo.png'
const GOOGLE_LOGO_URL = '/template-assets/GoogleLogo.png'
const COLUMN_MIN_WIDTH = 240

const pageStyle: CSSProperties = {
  backgroundColor: 'var(--astryx-color-background-body)',
}

const cardWrap: CSSProperties = {
  width: '100%',
  maxWidth: '1000px',
  marginInline: 'auto',
}

const coverImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const email = ref('')
const password = ref('')
const loginFailed = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)

function handleLogin() {
  if (!email.value || !password.value) {
    loginFailed.value = true
    return
  }
  isLoading.value = true
  loginFailed.value = false
  window.setTimeout(() => {
    isLoading.value = false
    isSuccess.value = true
  }, 2000)
}

function onPasswordChange(value: string) {
  password.value = value
  loginFailed.value = false
}
</script>

<template>
  <Center axis="both" :padding="6" min-height="100%" :style="pageStyle">
    <VStack :gap="4" width="100%">
      <div :style="cardWrap">
        <Card :padding="0" width="100%">
          <Grid
            :columns="{ minWidth: COLUMN_MIN_WIDTH, repeat: 'fit' }"
            :gap="8"
            align="stretch"
            class="login-split-grid"
          >
            <Section variant="transparent" :padding="0" height="100%">
              <VStack :gap="4" height="100%">
                <HStack :gap="2" align="center">
                  <Icon icon="i-heroicons-squares-2x2" />
                  <Text type="body" weight="bold">
                    Product Inc.
                  </Text>
                </HStack>
                <StackItem size="fill">
                  <Center axis="vertical" height="100%" :padding="0">
                    <EmptyState
                      v-if="isSuccess"
                      title="You're signed in"
                      description="Redirecting to your dashboard…"
                    >
                      <template #icon>
                        <Icon icon="i-heroicons-check-circle" size="lg" />
                      </template>
                    </EmptyState>
                    <VStack v-else :gap="4" h-align="stretch" width="100%">
                      <VStack :gap="1">
                        <Text type="display-1" as="h2">
                          Welcome back
                        </Text>
                        <Text type="body" color="secondary" size="sm">
                          Login to your Product Inc. account
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
                              Forgot your password?
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
                      <Grid :columns="2" :gap="3" justify="stretch">
                        <Button label="Apple" variant="secondary" size="lg">
                          <template #icon>
                            <img :src="APPLE_LOGO_URL" alt="" width="16" height="16" style="width: 16px; height: 16px">
                          </template>
                        </Button>
                        <Button label="Google" variant="secondary" size="lg">
                          <template #icon>
                            <img :src="GOOGLE_LOGO_URL" alt="" width="16" height="16" style="width: 16px; height: 16px">
                          </template>
                        </Button>
                      </Grid>
                    </VStack>
                  </Center>
                </StackItem>
                <Text v-if="!isSuccess" type="supporting" color="secondary">
                  Don't have an account?
                  <Link href="#" size="sm">
                    Sign up
                  </Link>
                </Text>
              </VStack>
            </Section>
            <div class="login-split-image">
              <Card variant="transparent" :padding="0" width="100%" height="100%">
                <img :style="coverImage" :src="COVER_IMAGE_URL" alt="Two people working at a desk">
              </Card>
            </div>
          </Grid>
        </Card>
      </div>
      <VStack h-align="center">
        <Text type="supporting" color="secondary">
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

<style>
.login-split-grid {
  container-type: inline-size;
  container-name: login-split;
  padding: var(--astryx-spacing-8);
}
.login-split-image {
  width: 100%;
  order: 0;
}
@container login-split (max-width: 511px) {
  .login-split-grid {
    padding: var(--astryx-spacing-4);
  }
  .login-split-image {
    order: -1;
  }
}
</style>
