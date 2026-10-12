<script setup lang="ts">
import { useAppShellMobile } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const {
  closeMobileNav,
  isMobile,
  isMobileNavEnabled,
  isMobileNavOpen,
  openMobileNav,
} = useAppShellMobile()
</script>

<template>
  <VStack v-if="!isMobileNavEnabled" :gap="2">
    <Button is-disabled label="Open navigation" variant="secondary" />
    <Text color="secondary" type="body">
      No active AppShell mobile navigation context was detected. This hook returns safe defaults outside AppShell, or when the surrounding AppShell has mobile navigation disabled.
    </Text>
  </VStack>
  <VStack v-else-if="!isMobile" :gap="2">
    <Button is-disabled label="Open navigation" variant="secondary" />
    <Text color="secondary" type="body">
      AppShell mobile navigation context is available. Narrow the viewport below the AppShell mobile breakpoint to make the custom trigger active.
    </Text>
  </VStack>
  <VStack v-else :gap="2">
    <HStack :gap="2" vAlign="center">
      <Button
        :label="isMobileNavOpen ? 'Close navigation' : 'Open navigation'"
        variant="secondary"
        @click="isMobileNavOpen ? closeMobileNav() : openMobileNav()"
      />
      <Text color="secondary" type="body">
        {{ isMobileNavOpen ? 'Mobile nav is open' : 'Mobile nav is closed' }}
      </Text>
    </HStack>
    <Text color="secondary" type="body">
      This button controls the nearest AppShell mobile nav from context.
    </Text>
  </VStack>
</template>
