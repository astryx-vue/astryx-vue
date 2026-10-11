<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { TopNav, TopNavHeading, TopNavItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <div class="nav-overview">
    <TopNav label="Main navigation">
      <template #heading>
        <TopNavHeading heading="My App" href="#home">
          <template #icon>
            <span class="i-carbon-cube" />
          </template>
        </TopNavHeading>
      </template>
      <TopNavItem href="#home" is-selected label="Home" />
      <TopNavItem href="#products" label="Products" />
      <TopNavItem href="#about" label="About" />
      <template #end>
        <Button is-icon-only label="Search" size="sm" variant="ghost">
          <template #icon>
            <span class="i-carbon-search" />
          </template>
        </Button>
      </template>
    </TopNav>
  </div>
</template>
