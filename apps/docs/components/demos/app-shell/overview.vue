<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { Heading } from '@astryx-vue/core/Heading'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <AppShell :content-padding="6" class="app-shell-showcase">
    <template #sideNav>
      <SideNav>
        <template #header>
          <SideNavHeading heading="App Shell" heading-href="#">
            <template #icon>
              <NavIcon icon-class="i-heroicons-cube" />
            </template>
          </SideNavHeading>
        </template>
        <SideNavSection title="Main" is-header-hidden>
          <SideNavItem label="Home" icon-class="i-heroicons-home-solid" is-selected href="#" />
          <SideNavItem label="Reports" icon-class="i-heroicons-chart-bar" href="#" />
          <SideNavItem label="Documents" icon-class="i-heroicons-document-text" href="#" />
          <SideNavItem label="Team" icon-class="i-heroicons-users" href="#" />
        </SideNavSection>
      </SideNav>
    </template>
    <VStack :gap="4">
      <Heading :level="3">
        Page Content
      </Heading>
      <Text type="body">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </Text>
    </VStack>
  </AppShell>
</template>

<style scoped>
.app-shell-showcase {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
