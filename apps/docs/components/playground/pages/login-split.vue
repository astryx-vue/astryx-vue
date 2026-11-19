<script setup lang="ts">
import type { Component, CSSProperties } from 'vue'
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
  useToast,
  VStack,
} from '@astryx-vue/core'
import { defineComponent, h, ref } from 'vue'

// 原版用 heroicons 的 SquaresPlusIcon；这个名字不在演练场的图标白名单里，按原版路径内联
const SquaresPlusIcon: Component = defineComponent({
  render: () => h('svg', {
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    'style': 'width:100%;height:100%',
  }, [h('path', { d: 'M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5m0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25m9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25' })]),
})

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

const showToast = useToast()

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
  <Center role="main" axis="both" :padding="6" min-height="100%" :style="pageStyle">
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
                  <Icon size="md" :icon="SquaresPlusIcon" />
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
                      :heading-level="1"
                    >
                      <template #icon>
                        <Icon name="heroicons:check-circle" size="lg" />
                      </template>
                    </EmptyState>
                    <VStack v-else :gap="4" h-align="stretch" width="100%">
                      <VStack :gap="1">
                        <Text type="display-1" as="h1">
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
                            <Link href="#" size="sm" color="secondary" type="supporting">
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
                        <Button label="Apple" variant="secondary" size="lg" @click="showToast({ body: 'Demo: Apple sign-in would start here', uniqueID: 'sign-in-apple' })">
                          <template #icon>
                            <img :src="APPLE_LOGO_URL" alt="" width="16" height="16" style="width: 16px; height: 16px">
                          </template>
                        </Button>
                        <Button label="Google" variant="secondary" size="lg" @click="showToast({ body: 'Demo: Google sign-in would start here', uniqueID: 'sign-in-google' })">
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
                  <Link href="#" type="supporting">
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
          <Link href="#" type="supporting">
            Terms of Service
          </Link>
          and
          <Link href="#" type="supporting">
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
