<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <AppShell :content-padding="6" style="height: 100%; min-height: 0">
    <template #sideNav>
      <SideNav>
        <template #header>
          <SideNavHeading heading="App Shell" heading-href="#">
            <template #icon>
              <span class="i-carbon-cube nav-mark" />
            </template>
          </SideNavHeading>
        </template>
        <SideNavSection is-header-hidden title="Main">
          <SideNavItem href="#" icon-class="i-carbon-home" is-selected label="Dashboard" />
          <SideNavItem href="#" icon-class="i-carbon-analytics" label="Analytics" />
          <SideNavItem href="#" icon-class="i-carbon-folder" label="Projects" />
        </SideNavSection>
        <SideNavSection title="Organization">
          <SideNavItem href="#" icon-class="i-carbon-user" label="Team" />
          <SideNavItem href="#" icon-class="i-carbon-settings" label="Settings" />
        </SideNavSection>
      </SideNav>
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
