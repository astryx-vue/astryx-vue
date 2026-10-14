<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { Divider } from '@astryx-vue/core/Divider'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack :gap="3" :max-width="480">
    <Collapsible value="deployment">
      <template #trigger>
        <Text type="body" weight="semibold">
          Deployment details
        </Text>
      </template>
      <Stack :gap="1">
        <Text type="body" color="secondary">
          Build 4,182 shipped to production from <code>main</code>. 847 modules compiled with no warnings, and the bundle came in at 142 KB gzipped — 3 KB under the budget.
        </Text>
        <Text type="supporting">
          Deployed by Sarah Chen · April 18, 3:42 PM · 2m 14s
        </Text>
      </Stack>
    </Collapsible>
    <Divider />
    <Collapsible value="environment">
      <template #trigger>
        <Text type="body" weight="semibold">
          Environment variables
        </Text>
      </template>
      <Stack :gap="1">
        <Text type="body" color="secondary">
          12 variables configured across production and preview. Secrets are encrypted at rest with AES-256 and are never printed in build logs.
        </Text>
        <Text type="supporting">
          Last updated March 30 by the deploy bot
        </Text>
      </Stack>
    </Collapsible>
    <Divider />
    <Collapsible value="rollback">
      <template #trigger>
        <Text type="body" weight="semibold">
          Rollback
        </Text>
      </template>
      <Stack :gap="1">
        <Text type="body" color="secondary">
          The previous build stays warm for 24 hours, so a rollback swaps traffic back in a few seconds without a rebuild. After that window a rollback redeploys from source and takes about two minutes.
        </Text>
        <Text type="supporting">
          Previous build 4,181 · expires in 19h
        </Text>
      </Stack>
    </Collapsible>
  </Stack>
</template>
