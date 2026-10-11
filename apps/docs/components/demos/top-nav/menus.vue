<script setup lang="ts">
import { NavIcon } from '@astryx-vue/core/NavItem'
import { TopNav, TopNavHeading, TopNavItem, TopNavMenu } from '@astryx-vue/core/TopNav'
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
      <TopNavMenu
        label="Products"
        :items="[
          { description: 'Track behavior', href: '#analytics', iconClass: 'i-carbon-analytics', label: 'Analytics' },
          { description: 'Enterprise protection', href: '#security', iconClass: 'i-carbon-security', label: 'Security' },
        ]"
      />
      <TopNavMenu
        label="Resources"
        :items="[
          { href: '#docs', label: 'Documentation' },
          { href: '#api', label: 'API Reference' },
          { href: '#community', label: 'Community Forum' },
        ]"
      />
      <TopNavItem href="#pricing" label="Pricing" />
    </TopNav>
  </div>
</template>
