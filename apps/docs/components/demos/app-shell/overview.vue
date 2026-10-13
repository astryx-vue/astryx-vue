<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'
import { Text } from '@astryx-vue/core/Text'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="app-shell-overview">
    <AppShell :content-padding="3" style="height: 100%; min-height: 0">
      <template #topNav>
        <TopNav label="Main navigation">
          <template #heading>
            <TopNavHeading heading="App">
              <template #icon>
                <span class="i-carbon-cube nav-mark" />
              </template>
            </TopNavHeading>
          </template>
          <template #start>
            <TopNavItem href="#" is-selected label="Home" />
            <TopNavItem href="#" label="Docs" />
          </template>
        </TopNav>
      </template>
      <template #sideNav>
        <SideNav>
          <SideNavItem href="#" icon-class="i-carbon-home" is-selected label="Dashboard" />
          <SideNavItem href="#" icon-class="i-carbon-settings" label="Settings" />
        </SideNav>
      </template>
      <Text type="supporting">
        Content
      </Text>
    </AppShell>
  </div>
</template>
