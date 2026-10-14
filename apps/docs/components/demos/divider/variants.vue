<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Divider } from '@astryx-vue/core/Divider'
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Section variant="transparent" width="100%">
    <Card :width="400">
      <VStack :gap="3">
        <VStack :gap="1">
          <Text type="label">
            Sign in with email
          </Text>
          <Text type="body">
            Enter your email and password to access your account.
          </Text>
        </VStack>
        <Divider label="or" />
        <VStack :gap="1">
          <Text type="label">
            Sign in with SSO
          </Text>
          <Text type="body">
            Use your company credentials to sign in automatically.
          </Text>
        </VStack>
        <Divider variant="strong" />
        <Text color="secondary" type="supporting">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </VStack>
    </Card>
  </Section>
</template>
