<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <AppShell :content-padding="6" style="height: 100%; min-height: 0">
    <template #topNav>
      <TopNav label="Main navigation">
        <template #heading>
          <TopNavHeading heading="App Shell">
            <template #icon>
              <span class="i-carbon-cube nav-mark" />
            </template>
          </TopNavHeading>
        </template>
        <template #start>
          <TopNavItem href="#" is-selected label="Home" />
          <TopNavItem href="#" label="Products" />
          <TopNavItem href="#" label="Docs" />
        </template>
      </TopNav>
    </template>
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
