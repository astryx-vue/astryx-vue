<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <AppShell :content-padding="6" style="height: 100%; min-height: 0">
    <VStack :gap="4">
      <p class="layout-title layout-title--page">
        Page Content
      </p>
      <Text type="body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </Text>
    </VStack>
  </AppShell>
</template>
