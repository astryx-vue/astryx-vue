<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { NavIcon } from '@astryx-vue/core/NavItem'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-frame">
    <TopNav label="Main navigation">
      <template #heading>
        <TopNavHeading heading="My App" href="#home">
          <template #icon>
            <NavIcon icon-class="i-carbon-cube" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#dashboard" icon-class="i-carbon-home" is-selected label="Dashboard" />
      <TopNavItem href="#reports" icon-class="i-carbon-document" label="Reports" />
      <template #end>
        <Button is-icon-only label="Search" variant="ghost">
          <template #icon>
            <span class="i-carbon-search" />
          </template>
        </Button>
        <Button is-icon-only label="Notifications" variant="ghost">
          <template #icon>
            <span class="i-carbon-notification" />
          </template>
        </Button>
        <Button label="Upgrade" variant="primary" />
      </template>
    </TopNav>
  </div>
</template>
