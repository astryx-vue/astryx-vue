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
            <NavIcon icon-class="i-carbon-cube" label="Product" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#overview" is-selected label="Overview" />
      <TopNavItem href="#analytics" label="Analytics" />
      <TopNavItem href="#reports" label="Reports" />
      <template #end>
        <Button is-icon-only label="Profile" variant="ghost">
          <template #icon>
            <span class="i-carbon-user" />
          </template>
        </Button>
      </template>
    </TopNav>
  </div>
</template>
